import * as vscode from 'vscode';
import { TraceServer } from './trace-server';

const server = new TraceServer();
const extensionId = 'vscode-trace-server';
const stopOrReset = extensionId + '.stop-or-reset';
const startIfStopped = extensionId + '.start-if-stopped';

let activation: vscode.ExtensionContext;

export function activate(context: vscode.ExtensionContext) {
    const vscodeTraceExtension = vscode.extensions.getExtension('eclipse-cdt.vscode-trace-extension');
    if (vscodeTraceExtension) {
        const api = vscodeTraceExtension.exports;
        const contributor = {
            startServer: () => server.startIfStopped(context),
            stopServer: () => server.stopOrReset(context)
        }
        api.addTraceServerContributor(contributor);
    }
    context.subscriptions.push(registerStopOrReset(context));
    context.subscriptions.push(registerStartIfStopped(context));
    activation = context;
}

export async function deactivate() {
    await server.shutdown(activation);
}

function registerStopOrReset(context: vscode.ExtensionContext | undefined): vscode.Disposable {
    return vscode.commands.registerCommand(stopOrReset, async () => {
        await server.stopOrReset(context);
    });
}
export const registerStopOrReset_test = registerStopOrReset;

function registerStartIfStopped(context: vscode.ExtensionContext | undefined): vscode.Disposable {
    return vscode.commands.registerCommand(startIfStopped, async () => {
        await server.startIfStopped(context);
    });
}
export const registerStartIfStopped_test = registerStartIfStopped;
