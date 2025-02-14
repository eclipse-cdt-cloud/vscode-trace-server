# VSCode Trace Server extension

This is a companion extension to the Trace Viewer for VSCode, that helps you manage the life-cycle (starting/stopping) of the trace server, that it needs to analyze and open traces.

The extension, once [configured](#configuration), can automatically start and stop your trace server for you, letting you enjoy using the Trace Viewer, without having to worry about that aspect. It also registers VSCode `Trace Server:` start/stop commands, that you can invoke as needed.

Note: It's assumed you already have a trace server installed locally. If that's not yet the case, please see [here](https://github.com/eclipse-cdt-cloud/vscode-trace-extension/blob/master/vscode-trace-extension/README.md#obtain-the-trace-server-eclipse-trace-compass) for more details about obtaining and installing the Eclipse Trace Compass server.

For information about building this extension from source, debugging it, and so on, please see the developer's documentation: [README-dev][dev-readme]

## Configuration

The following preference settings can be used, under `Trace Server`.

* trace server `path` : enter the absolute path and filename of your trace server
  * default value: `/usr/bin/tracecompass-server`
* Command-line `arguments`: Enter any CLI arguments you want passed to your trace server. See [here][server] for valid options for the incubator version of the Trace Compass server
  * Multiple arguments have to be separated by a space character

## Usage

### Starting the Trace Server

Automatic start:

If this extension is configured correctly, it will automatically start the trace server, if needed, upon a trace being opened in the trace viewer.

Manual start:

Use the `Trace Server: Start` command to launch the trace server instance. The latter should be made of two related processes; to find them, `grep` for `tracecompass` or the like.

Note: this extension is only aware of a running trace server if it started of helped start it, as per above. It will not know if you started the server on the CLI or outside using other means than described above.

### Stopping the Trace Server

Use the `Trace Server: stop or reset` command to kill both processes, stopping the server. If the server was stopped outside the application (e.g. killed), using this command will reset the known `pid` and allow to start it again.

Note that exiting the application should automatically stop the started server if started through it. 

## Acknowledgments

This extension was started from VSCode's [guide](https://code.visualstudio.com/api/get-started/your-first-extension) and related [samples](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample)

[dev-readme]: https://github.com/eclipse-cdt-cloud/vscode-trace-server/blob/main/README-dev.md
[server]: https://git.eclipse.org/r/plugins/gitiles/tracecompass.incubator/org.eclipse.tracecompass.incubator/+/refs/heads/master/trace-server/#running-the-server

[tsp]: https://github.com/eclipse-cdt-cloud/trace-server-protocol