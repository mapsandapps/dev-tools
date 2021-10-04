import * as assert from 'assert'
import { getQuickPickItems } from '../../../extension'

suite('getQuickPickItems', () => {
  test('Display correct quick pick items from selected hex', () => {
    var items = getQuickPickItems('#ff0000')
    assert.strictEqual(items.length, 2)

    var item1 = items[0]
    assert.strictEqual(item1.label, 'hex')
    assert.strictEqual(item1.description, '#ff0000')

    var item2 = items[1]
    assert.strictEqual(item2.label, 'rgb')
    assert.strictEqual(item2.description, 'rgb(255,0,0)')
  })

  test('Display correct quick pick items from selected rgb', () => {
    var items = getQuickPickItems('rgb(255,0,0)')
    assert.strictEqual(items.length, 2)

    var item = items[0]
    assert.strictEqual(item.label, 'hex')
    assert.strictEqual(item.description, '#ff0000')

    var item2 = items[1]
    assert.strictEqual(item2.label, 'rgb')
    assert.strictEqual(item2.description, 'rgb(255,0,0)')
  })
})
