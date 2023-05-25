# VSCode Trace Server extension

* This is a TypeScript extension, officially named `vscode-trace-server`.
* It is meant as companion to the [vscode-trace-extension][vscode-trace-extension].
* It registers `Trace Server:` start/stop commands, for a default instance locally.
* It depends on the [tsp-typescript-client][client] for server health check purposes.

This extension was started from Code's [guide][guide] and related [sample][sample].

## Documentation

This README is the usual entry point for documenting this extension.

* One may refer to the [contribution guide](CONTRIBUTING.md) for how to contribute.
* Please also refer to the [security policy](SECURITY.md) on a need basis.
* The usual [license description](LICENSE.md) file accompanies these too.

## Build

Run `yarn`, which should automatically include `yarn install`.

* This extension is bundled using `webpack`, originally based on [the guide][guide].
* There is no support yet for any automated CI on GitHub; planned for though.

## Test

Run `yarn test` on a need basis.

Alternatively, launch `Extension Tests` under `Run and Debug`.

## Installation

1. After [having built](#build) at least once, run `yarn vsce:package` ([more][vsce]) at will.
1. [Install][install] the hereby generated `vscode-trace-server-*.vsix` file.
1. Alternatively, simply launch the packaged extension using `Run Extension`.
1. Alternatively, see [these steps](#openvscode-server) for an `openvscode-server` deployment.
1. Through `Command Palette`, the `Trace Server:` start/stop commands should be available.

This extension can be installed in either one (or many) of:

* [VS Code][code] or [Codium][codium]/Code-OSS, or
* a [Theia][theia] application such as [Blueprint][blueprint].

A nearby [companion extension][vscode-trace-extension] installation renders a `Trace Server`
[status bar item][item]. A note:

* [Theia Blueprint][blueprint] extracts installed extensions under `/tmp/vscode-unpacked/`.
* Reinstalling an amended extension with the same version requires removing that extraction.
* This is necessary beside uninstalling the extension from the Theia UI, that is.
* Without this manual extension directory removal, Blueprint won't use the amended version.
* Stepping the extension version upon an amend or update shouldn't trigger that issue.

### openvscode-server

This may be used if willing to deploy this extension within [openvscode-server][linux].

1. Any local `~/.openvscode-server/` content will be (re)used if existing; remove at will (prior).
1. Run `yarn openvscode-server:install` to install `openvscode-server` locally, anywhere, once or so.
1. Run `yarn openvscode-server:start` to start the `openvscode-server` anytime, anywhere installed.

The server options passed through that start command are scripted in [./package.json](package.json).

* Run `yarn openvscode-server:start --help` to [list and show every such option and more][linux].
* Overall, this extension deployment is therefore virtually possible either locally or remotely.
* The client companion [vscode-trace-extension][vscode-trace-extension] is installed elsewhere.
* Thus, `vscode-trace-extension`'s `Trace Server` status bar item gets rendered from that client.
* Otherwise co-locating these two extensions lend interactions that aren't possible here, currently.

## Configuration

* Under the `Trace Server` preference settings, the trace server `path` can be entered.
  * Otherwise, the default `/usr/bin/tracecompass-server` is assumed locally.
* Command-line `arguments` can be optionally set, [any of these if Incubator][server] server.
  * Multiple arguments have to be separated by a space character each.

## Usage

1. Use the `Trace Server: start (if stopped)` command to launch the trace server instance.
1. The latter should be made of two related processes; `grep` for `tracecompass` or the like.
1. Use the `Trace Server: stop or reset` command to kill both processes, stopping the server.
1. Alternatively, exiting the application should automatically stop the started server if any.
1. Now, `Trace Server: start (if stopped)` only starts the server if known as currently stopped.

The extension checks for proper server startup/stopping; `ps` or [TSP][tsp] can be used alongside.

* `Trace Server: stop or reset` resets the known `pid` to none, if stopped outside of the extension.
* `Trace Server: stop or reset` used upon no previously started server (known `pid`) does nothing.

## Debugging

* One may launch the extension using `Run Extension`, to debug it with breakpoints, as usual.
* The same can be done for tests, launching `Extension Tests` to debug them.
* The enabled breakpoints get bound only upon exercising the extension.

## Development

The usual [Prettier][prettier] and [ESLint][eslint] combo in VS Code or Codium OSS is used.

* [This matcher][matcher] is also used, since the originally generated extension per [guide].
* Markdown gets linted with the (usual) [vscode-markdownlint][markdownlint] extension.
* [SonarLint][sonarlint] is also assumed while further developing this extension.

These are actual [recommended extensions herein](.vscode/extensions.json).

* Beside using [the extension][prettier], one may run `yarn prettier --write .` (or `--check`).

## Status

This extension is currently under [initial development][backlog].

[backlog]: https://github.com/eclipse-cdt-cloud/vscode-trace-extension/issues/15
[blueprint]: https://theia-ide.org/docs/blueprint_download
[client]: https://github.com/eclipse-cdt-cloud/tsp-typescript-client
[code]: https://code.visualstudio.com
[codium]: https://vscodium.com
[eslint]: https://open-vsx.org/extension/dbaeumer/vscode-eslint
[guide]: https://code.visualstudio.com/api/get-started/your-first-extension
[install]: https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix
[item]: https://github.com/eclipse-cdt-cloud/vscode-trace-extension/pull/120
[linux]: https://github.com/gitpod-io/openvscode-server#linux
[markdownlint]: https://open-vsx.org/extension/DavidAnson/vscode-markdownlint
[matcher]: https://open-vsx.org/extension/amodio/tsl-problem-matcher
[prettier]: https://open-vsx.org/extension/esbenp/prettier-vscode
[sample]: https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-sample
[server]: https://git.eclipse.org/r/plugins/gitiles/tracecompass.incubator/org.eclipse.tracecompass.incubator/+/refs/heads/master/trace-server/#running-the-server
[sonarlint]: https://open-vsx.org/extension/SonarSource/sonarlint-vscode
[theia]: https://theia-ide.org
[tsp]: https://github.com/eclipse-cdt-cloud/trace-server-protocol
[vsce]: https://code.visualstudio.com/api/working-with-extensions/publishing-extension#vsce
[vscode-trace-extension]: https://github.com/eclipse-cdt-cloud/vscode-trace-extension
