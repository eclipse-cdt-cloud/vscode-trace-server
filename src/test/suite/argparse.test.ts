import * as assert from 'assert';
import * as vscode from 'vscode';
import * as argparse from '../../argparse';

suite('Argument Parser Test Suite', () => {
    vscode.window.showInformationMessage('Start argument parser tests.');

    const prefix = 'Argument parser should be able to ';

    test(prefix + 'handle argument strings that do not use quoting', () => {
        const args = argparse.parseArgs('-vmargs -Dsome.property=value_without_spaces');
        assert.deepEqual(args, ['-vmargs', '-Dsome.property=value_without_spaces']);
    });

    test(prefix + 'handle argument strings that have extra whitespace between arguments', () => {
        const args = argparse.parseArgs('   -vmargs    -Dsome.property=value_without_spaces \t  ');
        assert.deepEqual(args, ['-vmargs', '-Dsome.property=value_without_spaces']);
    });

    test(prefix + 'handle argument strings that use quoting', () => {
        const args = argparse.parseArgs('   -vmargs    -Dsome.property="value with spaces" \t  ');
        assert.deepEqual(args, ['-vmargs', '-Dsome.property=value with spaces']);
    });

    test(prefix + 'recognize non-nested consecutive quotes as an empty string', () => {
        const parsed = argparse.parseArgs('empty_value=""');
        assert.deepEqual(parsed, ['empty_value=']);
    });

    test(prefix + 'recognize nested consecutive quotes as a literal quote character', () => {
        const args = argparse.parseArgs('   -vmargs    -Dsome.property="""in literal quotes""" \t  ');
        assert.deepEqual(args, ['-vmargs', '-Dsome.property="in literal quotes"']);
    });
});
