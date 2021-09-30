import * as vscode from 'vscode'
import * as chroma from 'chroma-js'

interface ColorFormat {
  transform: (color: string) => string
  label: string
}

const formats: ColorFormat[] = [
  {
    transform: (color: string) => {
      return chroma(color).hex()
    },
    label: 'hex'
  },
  {
    transform: (color: string) => {
      return chroma(color).css()
    },
    label: 'rgb'
  }
]

const convert8DigitToRgba = vscode.commands.registerTextEditorCommand(
  'color-code-converter.convert8DigitToRgba',
  (textEditor: vscode.TextEditor) => {
    let selections = textEditor.selections.map(
      (s) => new vscode.Range(s.start, s.end)
    )

    // TODO: do something if there are no selections: allow user input?

    const firstSelection = textEditor.document.getText(selections[0])

    const quickPickItems: vscode.QuickPickItem[] = formats.map((format) => {
      return {
        description: format.transform(firstSelection),
        label: format.label
      }
    })

    const onDidSelectItem = (value: vscode.QuickPickItem) => {
      const transformFunction = formats.find(
        ({ label }) => label === value.label
      )?.transform

      if (transformFunction) {
        // earlier edit no longer valid; start a new edit
        textEditor.edit((edit) => {
          for (const selection of textEditor.selections) {
            if (selection.isEmpty) {
              // TODO
            } else {
              const selectionText = textEditor.document.getText(selection)
              edit.replace(selection, transformFunction(selectionText))
            }
          }
        })
      } // TODO: else
    }

    vscode.window.showQuickPick(quickPickItems).then((selectedFormat) => {
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
