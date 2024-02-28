# VSCode Trace Server extension

This file contains information that could be interesting to developers, that want to modify, build, test, and debug this extension.

For general information, see the main [README.md](README.md)

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

First, you need Node.js and yarn:

It's suggested to install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage node on your machine. Once that's done, install the required version:

```bash
   nvm install 18
   # optional: make it the default version
   nvm alias default
   # or set it every time like so
   nvm use 18
```

Then install `yarn`:

```bash
npm i -g yarn  # the default version should be ok
```

To build, run `yarn`, which should automatically trigger `yarn install`.

* This extension is bundled using `webpack`, originally based on [the guide][guide].
* There is only a modest automated CI test suite being run on GitHub

## Test

Run `yarn test` on a need basis.

Alternatively, launch `Extension Tests` under `Run and Debug`.

## Installation

1. After [having built](#build) at least once, run `yarn vsce:package` ([more][vsce]) at will.
1. [Install][install] the hereby generated `vscode-trace-server-*.vsix` file.
1. Alternatively, simply launch the packaged extension using `Run Extension`.
1. Through `Command Palette`, the `Trace Server:` start/stop commands should be available.

This extension can be installed in either one (or many) of:

* [VS Code][code] or [Codium][codium]/Code-OSS, or
* a [Theia][theia] application such as [Blueprint][blueprint].

The dependent [Trace Viewer for VSCode][vscode-trace-extension] extension renders a `Trace Server`
[status bar item][item]. A note:

Reinstalling an amended extension that has the same version requires removing the unpacked extension, found under one of the following folders:

* [Theia Blueprint][blueprint]:  extracts installed extensions under `/tmp/vscode-unpacked/`.
* VSCode: extracts the installed extensions under the user's home, in folder `.vscode/extensions/`.

Alternatively, you may step the extension's version to avoid this issue.

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

* Beside using [the extension][prettier], one may run `prettier` from the CLI:

```bash
# confirm formatting is ok:
yarn format:check
# correct the formatting:
yarn format:write

```


[backlog]: https://github.com/eclipse-cdt-cloud/vscode-trace-extension/issues/15
[blueprint]: https://theia-ide.org/docs/blueprint_download
[client]: https://github.com/eclipse-cdt-cloud/tsp-typescript-client
[code]: https://code.visualstudio.com
[codium]: https://vscodium.com
[eslint]: https://open-vsx.org/extension/dbaeumer/vscode-eslint
[guide]: https://code.visualstudio.com/api/get-started/your-first-extension
[install]: https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix
[item]: https://github.com/eclipse-cdt-cloud/vscode-trace-extension/pull/120
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
