import { ChildProcess, spawn } from 'child_process';
import { TspClient } from 'tsp-typescript-client/lib/protocol/tsp-client';
import treeKill from 'tree-kill';
import * as vscode from 'vscode';
import { parseArgs } from './argparse';

// Based on github.com/eclipse-cdt-cloud/vscode-trace-extension/blob/master/vscode-trace-extension/package.json
// -for naming consistency purposes across sibling extensions/settings:
const section = 'trace-server.traceserver';
const clientSection = 'trace-compass.traceserver';

const key = 'pid';
const millis = 10000;
const none = -1;
const prefix = 'Trace Server';
const suffix = ' failure.';
const SHUTDOWN_DELAY = 2000;

export class TraceServer {
    private server: ChildProcess | undefined;
    private errorString: string | undefined;
    private stderr: string | undefined;
    private context: vscode.ExtensionContext | undefined;

    private handleStartUpError = (code: number | null): void => {
        this.errorString = 'Code: ' + code + (this.stderr !== undefined ? '. Error message: ' + this.stderr : '.');
    };

    private handleStartUpStderr = (data: string | undefined): void => {
        this.stderr = data;
    };

    private handleError = (code: number | null): void => {
        if (this.context) {
            this.context?.workspaceState.update(key, none);
        }
        this.server = undefined;
        this.setStatusIfAvailable(false);
        vscode.window.showErrorMessage(
            prefix + ' exited unexpectedly' + (code !== null ? ' with code ' + code : '') + '!'
        );
    };

    private async start(context: vscode.ExtensionContext | undefined) {
        const from = this.getSettings();
        const server = spawn(this.getPath(from), this.getArgs(from));

        if (!server.pid) {
            // Failed to spawn the child process due to errors, PID is undefined and an error is emitted.
            await new Promise<void>(resolve => {
                server.once('error', error => {
                    this.showError(prefix + ' startup' + suffix + ': ' + error);
                });
                resolve();
            });
            return;
        }
        this.server = server;
        await context?.workspaceState.update(key, this.server.pid);
        await this.waitFor(context);
    }

    async stopOrReset(context: vscode.ExtensionContext | undefined, reportNotStopped: boolean = true) {
        const pid: number | undefined = context?.workspaceState.get(key);
        const not = prefix + ' not stopped as none running or owned by us.';
        if (pid === none) {
            vscode.window.showWarningMessage(not);
            return;
        }
        if (pid && (await this.isUp())) {
            let id: NodeJS.Timeout;
            // recovering from workspaceState => no this.server set
            if (this.server) {
                this.server.off('exit', this.handleError);
                this.context = undefined;
                this.server.once('exit', () => {
                    this.showStatus(false);
                    clearTimeout(id);
                });
            }
            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: prefix,
                    cancellable: false
                },
                async progress => {
                    progress.report({ message: 'stopping...' });
                    const message = prefix + ' stopping' + suffix + ' Resetting.';
                    treeKill(pid, error => {
                        if (error) {
                            this.showErrorDetailed(message, error);
                        } else {
                            id = setTimeout(() => this.showError(message), millis);
                        }
                    });
                }
            );
        } else if (reportNotStopped) {
            vscode.window.showWarningMessage(not);
        }
        await context?.workspaceState.update(key, none);
        this.server = undefined;
    }

    async shutdown(context: vscode.ExtensionContext) {
        // Take the pid from the server instead from workspace state because
        // during shutdown the workspace can't be queried anymore
        const pid = this.server ? this.server.pid : undefined;
        if (!pid) {
            return;
        }
        if (pid) {
            // Remove all existing listeners to avoid unnecessary pop-ups
            this.server?.off('exit', this.handleError);
            this.context = undefined;
            treeKill(pid);
            // Allow the treeKill to finish collecting and killing all
            // spawned processes.
            await new Promise(resolve => setTimeout(resolve, SHUTDOWN_DELAY));

            // Try to reset pid in workspace state
            await context?.workspaceState.update(key, none);
        }
    }

    async startIfStopped(context: vscode.ExtensionContext | undefined) {
        const pid = context?.workspaceState.get(key);
        const stopped = !pid || pid === none;
        const foreigner = await this.isUp();

        if (stopped && !foreigner) {
            await this.start(context);
        } else if (foreigner) {
            vscode.window.showWarningMessage(prefix + ' not started as already running.');
        } else {
            // Not UP but there is still a pid stored.
            // Likely because Codium or so exited without one using the stop command prior.
            await context?.workspaceState.update(key, none);
            await this.start(context);
        }
    }

    private getPath(configuration: vscode.WorkspaceConfiguration): string {
        let path = configuration.get<string>('path');
        if (!path) {
            // Based on this extension's package.json default, if unset here:
            path = '/usr/bin/tracecompass-server';
        }
        return path;
    }
    getPath_test = this.getPath;

    private getArgs(configuration: vscode.WorkspaceConfiguration): string[] {
        let args = configuration.get<string>('arguments');
        if (!args) {
            args = '';
        }
        return parseArgs(args);
    }
    getArgs_test = this.getArgs;

    private getUrl(configuration: vscode.WorkspaceConfiguration): string {
        let url = configuration.get<string>('url');
        if (!url) {
            url = 'http://localhost:8080';
        }
        return url;
    }
    getUrl_test = this.getUrl;

    private getApiPath(configuration: vscode.WorkspaceConfiguration): string {
        let apiPath = configuration.get<string>('apiPath');
        if (!apiPath) {
            apiPath = 'tsp/api';
        }
        return apiPath;
    }
    getApiPath_test = this.getApiPath;

    private getSettings() {
        return vscode.workspace.getConfiguration(section);
    }

    private getClientSettings() {
        return vscode.workspace.getConfiguration(clientSection);
    }

    private getServerUrl() {
        const from = this.getClientSettings();
        const baseUrl = this.getUrl(from);
        return baseUrl.endsWith('/') ? baseUrl + this.getApiPath(from) : baseUrl + '/' + this.getApiPath(from);
    }

    private async waitFor(context: vscode.ExtensionContext | undefined) {
        if (this.server === undefined) {
            return;
        }

        this.context = context;
        const server = this.server;
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: prefix,
                cancellable: false
            },
            async progress => {
                progress.report({ message: 'starting up...' });
                try {
                    let timeout = false;
                    const timeoutId = setTimeout(() => (timeout = true), millis);

                    server.stderr?.once('data', this.handleStartUpStderr);
                    server.once('exit', this.handleStartUpError);

                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        if (await this.isUp()) {
                            clearTimeout(timeoutId);
                            this.showStatus(true);
                            break;
                        }

                        // Check if trace server exited with error
                        if (this.errorString !== undefined) {
                            const errorString = this.errorString;
                            this.errorString = undefined;
                            throw new Error(errorString);
                        }

                        // Check for overall timeout
                        if (timeout) {
                            await this.stopOrReset(context, false);
                            throw new Error(prefix + ' startup timed-out after ' + millis + 'ms.');
                        }

                        // Wait before trying again
                        await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
                    }
                } catch (error) {
                    this.showErrorDetailed(prefix + ' starting up' + suffix, error as Error);
                    return;
                } finally {
                    // Remove all listener needed during startup
                    server.off('exit', this.handleStartUpError);
                    server.stderr?.off('data', this.handleStartUpStderr);
                    // Add listener to catch when server exits unexpectedly
                    server.once('exit', this.handleError);
                }
            }
        );
    }

    private async isUp(): Promise<boolean> {
        const client = new TspClient(this.getServerUrl());
        const health = await client.checkHealth();
        const status = health.getModel()?.status;
        return health.isOk() && status === 'UP';
    }

    private async showError(message: string) {
        console.error(message);
        vscode.window.showErrorMessage(message);
        const up = await this.isUp();
        if (up) {
            vscode.window.showWarningMessage(prefix + ' is still running, despite this error.');
        }
        this.setStatusIfAvailable(up);
    }

    private showErrorDetailed(message: string, error: Error) {
        const details = error.name + ' - ' + error?.message;
        vscode.window.showErrorMessage(details);
        console.error(details);
        this.showError(message);
    }

    private showStatus(started: boolean) {
        if (started) {
            vscode.window.showInformationMessage(prefix + ' started.');
        } else {
            vscode.window.showInformationMessage(prefix + ' stopped.');
        }
        this.setStatusIfAvailable(started);
    }

    private setStatusIfAvailable(started: boolean) {
        const commands = vscode.commands.getCommands();
        commands.then(commandArray => {
            const fromTraceExtension = 'serverStatus';
            const startCommand = fromTraceExtension + '.started';
            if (commandArray.findIndex(val => val === startCommand) > 0) {
                if (started) {
                    vscode.commands.executeCommand(startCommand);
                } else {
                    vscode.commands.executeCommand(fromTraceExtension + '.stopped');
                }
            }
        });
    }
}
