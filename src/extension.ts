import {
  ExtensionContext,
  QuickPickItem,
  Range,
  TextEditor,
  TextEditorEdit,
  commands,
  window,
  Disposable
} from 'vscode'
import * as chroma from 'chroma-js'

interface ColorFormat extends QuickPickItem {
  command: string
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
  const color = firstSelection || '#000000'
  return [
    {
      command: 'convertToHex',
      label: 'hex',
      description: convertToHex(color),
      transform: convertToHex
    },
    {
      command: 'convertToRGB',
      label: 'rgb',
      description: convertToRGB(color),
      transform: convertToRGB
    },
    {
      command: 'convertToHSL',
      label: 'hsl',
      description: convertToHSL(color),
      transform: convertToHSL
    }
  ]
}

// the main color conversion menu with quick pick items for the various conversions
const convertColor = commands.registerTextEditorCommand(
  'color-converter.convertColor',
  async (textEditor: TextEditor) => {
    let selections = textEditor.selections.map((s) => new Range(s.start, s.end))

    // TODO: do something if there are no selections: allow user input? select all text?

    const onDidSelectItem = (selectedFormat: ColorFormat) => {
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

    const selectedFormat = await window.showQuickPick(
      getQuickPickItems(firstSelection)
    )

    if (!selectedFormat) return

    onDidSelectItem(selectedFormat)
  }
)

function activateQuickCommands(context: ExtensionContext) {
  const colorCommands = getQuickPickItems('')

  colorCommands.map((command) => {
    const disposable = commands.registerTextEditorCommand(
      `color-converter.${command.command}`,
      async (textEditor: TextEditor, editBuilder: TextEditorEdit) => {
        // TODO: do something if there are no selections: allow user input? select all text?

        for (const selection of textEditor.selections) {
          if (selection.isEmpty) {
            // TODO
          } else {
            const selectionText = textEditor.document.getText(selection)
            editBuilder.replace(selection, command.transform(selectionText))
          }
        }
      }
    )

    context.subscriptions.push(disposable)
  })
}

export function activate(context: ExtensionContext) {
  // The command has been defined in the package.json file
  // The commandId parameter must match the command field in package.json

  context.subscriptions.push(convertColor)
  activateQuickCommands(context)
}

const transform = (hexCode: string) => {
  return chroma(hexCode).css()
}

export function deactivate() {}
