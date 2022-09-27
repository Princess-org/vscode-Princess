import * as path from "path"
import { workspace, ExtensionContext, window, OutputChannel } from "vscode"

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from "vscode-languageclient/node"

let client: LanguageClient
let log: OutputChannel

export function activate(context: ExtensionContext) {
	log = window.createOutputChannel("Princess")
	log.show()
	log.appendLine("Starting Princess Extension")

    let config = workspace.getConfiguration()
    let workspaceFolder = config.get("princess.compilerPath") as string

    let runCommand = "princess"
    let debugCommand = "princess2"
    if (workspaceFolder != undefined) {
        runCommand = path.join(workspaceFolder, "bin", runCommand)
        debugCommand = path.join(workspaceFolder, "bin", debugCommand)
    }

	const serverOptions: ServerOptions = {
		run: { command: runCommand, transport: TransportKind.stdio, args: ["--language-server"] },
		debug: { command: debugCommand, transport: TransportKind.stdio, args: ["--language-server"] }
	}

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: "file", language: "princess" }],
		outputChannel: log
	}

	// Create the language client and statrt the client.
	client = new LanguageClient(
		"Princess",
		"Princess",
		serverOptions,
		clientOptions
	)

	// Start the client. This will also launch the server
	client.start()
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined
	}
	return client.stop()
}
