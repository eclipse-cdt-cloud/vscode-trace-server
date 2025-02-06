import * as assert from 'assert';
import * as vscode from 'vscode';
import { TraceServer } from '../../trace-server';

suite('TraceServer Test Suite', () => {
    vscode.window.showInformationMessage('Start trace-server tests.');

    const from = vscode.workspace.getConfiguration('trace-server.traceserver');
    const server = new TraceServer();
    const prefix = 'TraceServer should be able to get default ';

    test(prefix + 'path', () => {
        const path = server.getPath_test(from);
        assert.strictEqual(path, '/usr/bin/tracecompass-server');
    });

    test(prefix + 'arguments', () => {
        const args = server.getArgs_test(from);
        assert.deepEqual(args, []);
    });

    test(prefix + 'url', () => {
        const url = server.getUrl_test(from);
        assert.strictEqual(url, 'http://localhost:8080');
    });

    test(prefix + 'apiPath', () => {
        const apiPath = server.getApiPath_test(from);
        assert.strictEqual(apiPath, 'tsp/api');
    });
});
