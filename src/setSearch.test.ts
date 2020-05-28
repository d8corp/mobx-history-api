import setSearch from './setSearch'

describe('setSearch', () => {
  it('simple', () => {
    expect(setSearch('/', 'key', 'value')).toBe('/?key=value')
    expect(setSearch('', 'key', 'value')).toBe('?key=value')
    expect(setSearch('?test=checked', 'key', 'value')).toBe('?test=checked&key=value')
    expect(setSearch('/path/1#test', 'key', 'value')).toBe('/path/1?key=value#test')
    expect(setSearch('/path/1?key', 'key', 'value')).toBe('/path/1?key=value')
    expect(setSearch('/path/1?key=value', 'key', 'value1')).toBe('/path/1?key=value1')
    expect(setSearch('/path/1?key1=value&key&key2', 'key', 'value1')).toBe('/path/1?key1=value&key=value1&key2')
    expect(setSearch('/path/1?key1=value&key&key2', 'key')).toBe('/path/1?key1=value&key2')
  })
})
