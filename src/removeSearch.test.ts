import removeSearch from './removeSearch'

describe('removeSearch', () => {
  it('simple', () => {
    expect(removeSearch('/test?key=value#hashtag', 'key')).toBe('/test#hashtag')
    expect(removeSearch('/test?key1=value&key#hashtag', 'key')).toBe('/test?key1=value#hashtag')
    expect(removeSearch('/test?key1=value&key2#hashtag', 'key')).toBe('/test?key1=value&key2#hashtag')
    expect(removeSearch('/test?key1=value&key&key2#hashtag', 'key')).toBe('/test?key1=value&key2#hashtag')
  })
})
