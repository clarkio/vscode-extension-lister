// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { writeExtensionListFile } from './file-manager';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "extension-lister" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.createList',
    () => {
      const activeExtensions = vscode.extensions.all.filter(
        (extension: vscode.Extension<any>) => {
          return (
            extension.isActive && // make sure it is active
            !extension.packageJSON.isBuiltin && // don't include built in
            !extension.packageJSON.categories.some(
              // don't include themes
              (category: string) => category.toLocaleLowerCase() === 'themes'
            )
          );
        }
      );

      let extensionListData = ''; // variable to hold the file contents as a string
      activeExtensions.forEach((extension: vscode.Extension<any>) => {
        // thanks to TypeScript and the exposed Extension type from the VS Code API we get intellisense to see the properties of each extension.
        // In particular we want to read the display name property found in the `packageJSON` object and generate the URL using the extension ID property
        extensionListData += `${
          extension.packageJSON.displayName
        }: https://marketplace.visualstudio.com/items?itemName=${
          extension.id
        }\n`;
      });

      vscode.window.showSaveDialog({ filters: { '*': ['txt'] } }).then(uri => {
        if (!uri) {
          // This pops up an error notification dialog
          vscode.window.showErrorMessage(
            'You must select a file location to create the extension list'
          );
          return; // Don't proceed if we don't have a file URI to write to
        }

        // Provide the full path on the file system for the file to write to and the contents we want to write to that file
        writeExtensionListFile(uri.fsPath, extensionListData)
          .then(() => {
            // if the file was created successfully show an alert notification
            vscode.window.showInformationMessage(
              'Extension list was successfully created'
            );
          })
          .catch((error: any) => {
            // if the file failed to be created show an error notification
            vscode.window.showErrorMessage(
              'There was an issue creating the extension list'
            );
            console.error(error);
          });
      });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
