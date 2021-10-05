import * as assert from 'assert'

import {
  Position,
  Selection,
  SnippetString,
  commands,
  window,
  workspace
} from 'vscode'

suite('Extension Test Suite', () => {
  window.showInformationMessage('Start all tests.')

  test('Converts to rgb', async () => {
    const snippetString = new SnippetString().appendText('#EAAA00')

    const document = await workspace.openTextDocument()
    const editor = await window.showTextDocument(document)
    await editor.insertSnippet(snippetString)
    await assert.strictEqual(document.getText(), '#EAAA00')
    editor.selection = await new Selection(
      new Position(0, 0),
      new Position(0, 7)
    )
    commands.executeCommand('color-converter.convertColor').then(() => {
      // select 2nd item
      commands
        .executeCommand('workbench.action.quickOpenSelectNext')
        .then(() => {
          commands
            .executeCommand('workbench.action.quickOpenSelectNext')
            .then(() => {
              commands
                .executeCommand('workbench.action.acceptSelectedQuickOpenItem')
                .then(async () => {
                  const newText = await document.getText()
                  await assert.strictEqual(newText, 'rgb(234,170,0)')
                })
            })
        })
    })
  })
})
