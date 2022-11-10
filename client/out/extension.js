"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path = require("path");
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
let client;
let log;
function activate(context) {
    log = vscode_1.window.createOutputChannel("Princess");
    log.show();
    log.appendLine("Starting Princess Extension");
    let config = vscode_1.workspace.getConfiguration();
    let compilerPath = config.get("princess.compilerPath");
    let runCommand = "princess";
    let debugCommand = "princess2";
    if (compilerPath != undefined) {
        runCommand = path.join(compilerPath, "bin", runCommand);
        debugCommand = path.join(compilerPath, "bin", debugCommand);
    }
    const serverOptions = {
        run: { command: runCommand, transport: node_1.TransportKind.stdio, args: ["--language-server"] },
        debug: { command: debugCommand, transport: node_1.TransportKind.stdio, args: ["--language-server"] }
    };
    // Options to control the language client
    const clientOptions = {
        documentSelector: [{ scheme: "file", language: "princess" }],
        outputChannel: log
    };
    // Create the language client and statrt the client.
    client = new node_1.LanguageClient("Princess", "Princess", serverOptions, clientOptions);
    // Start the client. This will also launch the server
    client.start();
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map