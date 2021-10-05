import * as assert from 'assert'
import { getQuickPickItems } from '../../../extension'

suite('getQuickPickItems', () => {
  test('Display correct quick pick items from selected hex', () => {
    var items = getQuickPickItems('#eaaa00')
    assert.strictEqual(items.length, 2)

    var item1 = items[0]
    assert.strictEqual(item1.label, 'hex')
    assert.strictEqual(item1.description, '#eaaa00')

    var item2 = items[1]
    assert.strictEqual(item2.label, 'rgb')
    assert.strictEqual(item2.description, 'rgb(234,170,0)')
  })

  test('Display correct quick pick items from selected rgb', () => {
    var items = getQuickPickItems('rgb(234,170,0)')
    assert.strictEqual(items.length, 2)

    var item = items[0]
    assert.strictEqual(item.label, 'hex')
    assert.strictEqual(item.description, '#eaaa00')

    var item2 = items[1]
    assert.strictEqual(item2.label, 'rgb')
    assert.strictEqual(item2.description, 'rgb(234,170,0)')
  })
})
