import * as vscode from 'vscode'
import * as chroma from 'chroma-js'

interface ColorFormat extends vscode.QuickPickItem {
  label: string
  description: string
  transform: (color: string) => string
}

function round(number: number, places: number): number {
  return Math.round(number * Math.pow(10, places)) / Math.pow(10, places)
}

function convertToHex(color: string): string {
  return chroma(color).hex()
}

function convertToRGB(color: string): string {
  return chroma(color).css()
}

function convertToHSL(color: string): string {
  const hsl = chroma(color).hsl()
  return `hsl(${round(hsl[0], 0)},${round(hsl[1], 2)},${round(hsl[2], 2)})`
}

export function getQuickPickItems(firstSelection: string): ColorFormat[] {
  return [
    {
      label: 'hex',
      description: convertToHex(firstSelection),
      transform: convertToHex
    },
    {
      label: 'rgb',
      description: convertToRGB(firstSelection),
      transform: convertToRGB
    },
    {
      label: 'hsl',
      description: convertToHSL(firstSelection),
      transform: convertToHSL
    }
  ]
}

const convertColor = vscode.commands.registerTextEditorCommand(
  'color-converter.convertColor',
  async (textEditor: vscode.TextEditor) => {
    let selections = textEditor.selections.map(
      (s) => new vscode.Range(s.start, s.end)
    )

    // TODO: do something if there are no selections: allow user input?

    const onDidSelectItem = (selectedFormat: ColorFormat) => {
      // earlier edit no longer valid; start a new edit
      textEditor.edit((edit) => {
        for (const selection of textEditor.selections) {
          if (selection.isEmpty) {
            // TODO
          } else {
            const selectionText = textEditor.document.getText(selection)
            edit.replace(selection, selectedFormat.transform(selectionText))
          }
        }
      })
    }

    const firstSelection = textEditor.document.getText(selections[0])

    const selectedFormat = await vscode.window.showQuickPick(
      getQuickPickItems(firstSelection)
    )

    if (!selectedFormat) return

    onDidSelectItem(selectedFormat)
  }
)

export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // The commandId parameter must match the command field in package.json

  context.subscriptions.push(convertColor)
}

const transform = (hexCode: string) => {
  return chroma(hexCode).css()
}

export function deactivate() {}
