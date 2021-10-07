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

  suite('Convert to hex', () => {
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
  })

  suite('Convert to rgb(a)', () => {
    test('Converts hex to rgb', async () => {
      const document = await workspace.openTextDocument()
      const editor = await window.showTextDocument(document)
      await editor.edit((edit) => edit.insert(new Position(0, 0), '#EAAA00'))

      editorSelectAll(editor)
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

    test('Converts 8-digit hex to rgba', async () => {
      const document = await workspace.openTextDocument()
      const editor = await window.showTextDocument(document)
      await editor.edit((edit) => edit.insert(new Position(0, 0), '#eaaa0080'))

      editorSelectAll(editor)
      await commands.executeCommand('color-converter.convertColor')
      await commands.executeCommand('workbench.action.quickOpenNavigateNext')
      await commands.executeCommand('workbench.action.quickOpenNavigateNext')
      await commands.executeCommand(
        'workbench.action.acceptSelectedQuickOpenItem'
      )
      await new Promise((resolve) => setTimeout(resolve, 200))

      const newText = document.getText()
      assert.strictEqual(newText, 'rgba(234,170,0,0.5)')
    })
  })

  suite('Convert to hsl', () => {
    test('Converts hex to hsl', async () => {
      const document = await workspace.openTextDocument()
      const editor = await window.showTextDocument(document)
      await editor.edit((edit) => edit.insert(new Position(0, 0), '#B3A369'))

      editorSelectAll(editor)
      await commands.executeCommand('color-converter.convertColor')
      await commands.executeCommand('workbench.action.quickOpenNavigateNext')
      await commands.executeCommand('workbench.action.quickOpenNavigateNext')
      await commands.executeCommand('workbench.action.quickOpenNavigateNext')
      await commands.executeCommand(
        'workbench.action.acceptSelectedQuickOpenItem'
      )
      await new Promise((resolve) => setTimeout(resolve, 200))

      const newText = document.getText()
      assert.strictEqual(newText, 'hsl(47,0.33,0.56)')
    })
  })

  suite('Multi-select', () => {
    test('converts multiple colors', async () => {
      const document = await workspace.openTextDocument()
      const editor = await window.showTextDocument(document)
      await editor.edit((edit) =>
        edit.insert(new Position(0, 0), '#EAAA00\n#5F249F')
      )

      editor.selections = [
        new Selection(new Position(0, 0), new Position(0, 7)),
        new Selection(new Position(1, 0), new Position(1, 7))
      ]

      await commands.executeCommand('color-converter.convertColor')
      await commands.executeCommand('workbench.action.quickOpenNavigateNext')
      await commands.executeCommand('workbench.action.quickOpenNavigateNext')
      await commands.executeCommand(
        'workbench.action.acceptSelectedQuickOpenItem'
      )
      await new Promise((resolve) => setTimeout(resolve, 200))

      // TODO: it would be nice to verify that the menu says "#EAAA00" and "rgb(234,170,0)"

      const newText = document.getText()
      assert.match(newText, /rgb\(234,170,0\)/)
      assert.match(newText, /rgb\(95,36,159\)/)
    })

    test.skip('converts valid color and leaves invalid one', async () => {
      const document = await workspace.openTextDocument()
      const editor = await window.showTextDocument(document)
      await editor.edit((edit) =>
        edit.insert(new Position(0, 0), '#EAAA00\npotato')
      )

      editor.selections = [
        new Selection(new Position(0, 0), new Position(0, 7)),
        new Selection(new Position(1, 0), new Position(1, 6))
      ]

      await commands.executeCommand('color-converter.convertColor')
      await commands.executeCommand('workbench.action.quickOpenNavigateNext')
      await commands.executeCommand('workbench.action.quickOpenNavigateNext')
      await commands.executeCommand(
        'workbench.action.acceptSelectedQuickOpenItem'
      )
      await new Promise((resolve) => setTimeout(resolve, 200))

      const newText = document.getText()
      assert.strictEqual(newText, 'rgb(234,170,0)\npotato')
    })
  })
})
