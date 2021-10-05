import * as assert from 'assert'

import {
  Position,
  Range,
  Selection,
  TextEditor,
  commands,
  window,
  workspace
} from 'vscode'

function editorSelectAll(editor: TextEditor): TextEditor {
  const endpoint = editor.document.getText().length
  const fullRange = new Range(
    editor.document.positionAt(0),
    editor.document.positionAt(endpoint)
  )

  editor.selection = new Selection(fullRange.start, fullRange.end)
  return editor
}

suite('Extension Test Suite', () => {
  window.showInformationMessage('Start all tests.')

  test('Converts hex to lowercase hex', async () => {
    const document = await workspace.openTextDocument()
    const editor = await window.showTextDocument(document)
    await editor.edit((edit) => edit.insert(new Position(0, 0), '#EAAA00'))

    editorSelectAll(editor)
    await commands.executeCommand('color-converter.convertColor')
    await commands.executeCommand('workbench.action.quickOpenNavigateNext')
    await commands.executeCommand(
      'workbench.action.acceptSelectedQuickOpenItem'
    )
    await new Promise((resolve) => setTimeout(resolve, 200))

    const newText = document.getText()
    assert.strictEqual(newText, '#eaaa00')
  })

  test('Converts hex to rgb', async () => {
    const document = await workspace.openTextDocument()
    const editor = await window.showTextDocument(document)
    await editor.edit((edit) => edit.insert(new Position(0, 0), '#EAAA00'))
    await new Promise((resolve) => setTimeout(resolve, 200))

    editorSelectAll(editor)
    await new Promise((resolve) => setTimeout(resolve, 200))
    await commands.executeCommand('color-converter.convertColor')
    await commands.executeCommand('workbench.action.quickOpenNavigateNext')
    await commands.executeCommand('workbench.action.quickOpenNavigateNext')
    await commands.executeCommand(
      'workbench.action.acceptSelectedQuickOpenItem'
    )
    await new Promise((resolve) => setTimeout(resolve, 200))

    const newText = document.getText()
    assert.strictEqual(newText, 'rgb(234,170,0)')
  })

  test('Converts rgb to hex', async () => {
    const document = await workspace.openTextDocument()
    const editor = await window.showTextDocument(document)
    await editor.edit((edit) =>
      edit.insert(new Position(0, 0), 'rgb(234,170,0)')
    )

    editorSelectAll(editor)
    await commands.executeCommand('color-converter.convertColor')
    await commands.executeCommand('workbench.action.quickOpenNavigateNext')
    await commands.executeCommand(
      'workbench.action.acceptSelectedQuickOpenItem'
    )
    await new Promise((resolve) => setTimeout(resolve, 200))

    const newText = document.getText()
    assert.strictEqual(newText, '#eaaa00')
  })

  test('Converts rgba to 8-digit hex', async () => {
    const document = await workspace.openTextDocument()
    const editor = await window.showTextDocument(document)
    await editor.edit((edit) =>
      edit.insert(new Position(0, 0), 'rgba(234,170,0,0.5)')
    )

    editorSelectAll(editor)
    await commands.executeCommand('color-converter.convertColor')
    await commands.executeCommand('workbench.action.quickOpenNavigateNext')
    await commands.executeCommand(
      'workbench.action.acceptSelectedQuickOpenItem'
    )
    await new Promise((resolve) => setTimeout(resolve, 200))

    const newText = document.getText()
    assert.strictEqual(newText, '#eaaa0080')
  })

  test('Converts rgba to 8-digit hex', async () => {
    const document = await workspace.openTextDocument()
    const editor = await window.showTextDocument(document)
    await editor.edit((edit) =>
      edit.insert(new Position(0, 0), 'rgba(234,170,0,0.5)')
    )

    editorSelectAll(editor)
    await commands.executeCommand('color-converter.convertColor')
    await commands.executeCommand('workbench.action.quickOpenNavigateNext')
    await commands.executeCommand(
      'workbench.action.acceptSelectedQuickOpenItem'
    )
    await new Promise((resolve) => setTimeout(resolve, 200))

    const newText = document.getText()
    assert.strictEqual(newText, '#eaaa0080')
  })
})
