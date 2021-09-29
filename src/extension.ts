import * as vscode from 'vscode'
import * as chroma from 'chroma-js'

export function activate(context: vscode.ExtensionContext) {
  console.debug(
    'Congratulations, your extension "color-code-converter" is now active!'
  )

  // The command has been defined in the package.json file
  // The commandId parameter must match the command field in package.json
  let convert8DigitToRgba = vscode.commands.registerCommand(
    'color-code-converter.convert8DigitToRgba',
    async () => {
      let colorInput: string | undefined = await vscode.window.showInputBox({
        placeHolder: 'Color code'
      })

      if (!colorInput) return // TODO

      vscode.window.showInformationMessage(chroma(colorInput).css())
    }
  )

  context.subscriptions.push(convert8DigitToRgba)
}

export function deactivate() {}
