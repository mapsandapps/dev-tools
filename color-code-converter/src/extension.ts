import * as vscode from 'vscode'
import * as chroma from 'chroma-js'

export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // The commandId parameter must match the command field in package.json
  const convert8DigitToRgba = vscode.commands.registerTextEditorCommand(
    'color-code-converter.convert8DigitToRgba',
    (editor, editBuilder) => {
      let selections = editor.selections.map(
        (s) => new vscode.Range(s.start, s.end)
      )

      selections.map((selection) => {
        const selectionText = editor.document.getText(selection)
        editBuilder.replace(selection, transform(selectionText))
      })
    }
  )

  context.subscriptions.push(convert8DigitToRgba)
}

const transform = (hexCode: string) => {
  return chroma(hexCode).css()
}

export function deactivate() {}
