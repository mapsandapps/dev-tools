import * as vscode from 'vscode'
import * as chroma from 'chroma-js'

interface ColorFormat extends vscode.QuickPickItem {
  description: string
  label: string
  transform: (color: string) => string
}

const convert8DigitToRgba = vscode.commands.registerTextEditorCommand(
  'color-code-converter.convert8DigitToRgba',
  (textEditor: vscode.TextEditor) => {
    let selections = textEditor.selections.map(
      (s) => new vscode.Range(s.start, s.end)
    )

    // TODO: do something if there are no selections: allow user input?

    const firstSelection = textEditor.document.getText(selections[0])

    const formats: ColorFormat[] = [
      {
        description: chroma(firstSelection).hex(),
        label: 'hex',
        transform: (color: string) => {
          return chroma(color).hex()
        }
      },
      {
        description: chroma(firstSelection).css(),
        label: 'rgb',
        transform: (color: string) => {
          return chroma(color).css()
        }
      }
    ]

    const onDidSelectItem = (value: ColorFormat) => {
      // earlier edit no longer valid; start a new edit
      textEditor.edit((edit) => {
        for (const selection of textEditor.selections) {
          if (selection.isEmpty) {
            // TODO
          } else {
            const selectionText = textEditor.document.getText(selection)
            edit.replace(selection, value.transform(selectionText))
          }
        }
      })
    }

    vscode.window.showQuickPick(formats).then((selectedFormat) => {
      if (selectedFormat) {
        onDidSelectItem(selectedFormat)
      }
    })
  }
)

export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // The commandId parameter must match the command field in package.json

  context.subscriptions.push(convert8DigitToRgba)
}

const transform = (hexCode: string) => {
  return chroma(hexCode).css()
}

export function deactivate() {}
