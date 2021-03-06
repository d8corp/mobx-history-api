import setSearch from './setSearch'

describe('setSearch', () => {
  it('remove', () => {
    expect(setSearch('', 'key')).toBe('')
    expect(setSearch('?', 'key')).toBe('')
    expect(setSearch('?key', 'key')).toBe('')
    expect(setSearch('?key=value', 'key')).toBe('')
    expect(setSearch('?test=value', 'key')).toBe('?test=value')
    expect(setSearch('?test=value&key=value', 'key')).toBe('?test=value')
    expect(setSearch('?test&key=value', 'key')).toBe('?test')
    expect(setSearch('?key=value&test&', 'key')).toBe('?test&')
    expect(setSearch('key', 'key')).toBe('key')

    expect(setSearch('/test', 'key')).toBe('/test')
    expect(setSearch('/test?', 'key')).toBe('/test')
    expect(setSearch('/test?key', 'key')).toBe('/test')
    expect(setSearch('/test?key=value', 'key')).toBe('/test')
    expect(setSearch('/test?test=value', 'key')).toBe('/test?test=value')
    expect(setSearch('/test?test=value&key=value', 'key')).toBe('/test?test=value')
    expect(setSearch('/test?test&key=value', 'key')).toBe('/test?test')
    expect(setSearch('/test?key=value&test&', 'key')).toBe('/test?test&')
    expect(setSearch('/test/key', 'key')).toBe('/test/key')
  })
  it('set', () => {
    expect(setSearch('/', 'key', '')).toBe('/?key')
    expect(setSearch('/', 'key', 'value')).toBe('/?key=value')
    expect(setSearch('', 'key', 'value')).toBe('?key=value')
    expect(setSearch('?', 'key', 'value')).toBe('?key=value')
    expect(setSearch('?test=checked', 'key', 'value')).toBe('?test=checked&key=value')
    expect(setSearch('/path/1#test', 'key', 'value')).toBe('/path/1?key=value#test')
    expect(setSearch('/path/1?key', 'key', 'value')).toBe('/path/1?key=value')
    expect(setSearch('/path/1?key=value', 'key', 'value1')).toBe('/path/1?key=value1')
    expect(setSearch('/path/1?key1=value&key&key2', 'key', 'value1')).toBe('/path/1?key1=value&key=value1&key2')
    expect(setSearch('/path/1?key1=value&key&key2', 'key')).toBe('/path/1?key1=value&key2')
  })
})
