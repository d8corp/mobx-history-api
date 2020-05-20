import parseUrl from './parseUrl'

describe('parseUrl', () => {
  it('simple', () => {
    expect(parseUrl('/test?key=value#hashtag')).toEqual({
      path: '/test',
      search: 'key=value',
      hash: 'hashtag',
    })
    expect(parseUrl('/test')).toEqual({
      path: '/test',
      search: undefined,
      hash: undefined,
    })
    expect(parseUrl('?test')).toEqual({
      path: undefined,
      search: 'test',
      hash: undefined,
    })
    expect(parseUrl('#test')).toEqual({
      path: undefined,
      search: undefined,
      hash: 'test',
    })
    expect(parseUrl('?key=value#test')).toEqual({
      path: undefined,
      search: 'key=value',
      hash: 'test',
    })
    expect(parseUrl('test1?#test2')).toEqual({
      path: 'test1',
      search: '',
      hash: 'test2',
    })
    expect(parseUrl('test1?#')).toEqual({
      path: 'test1',
      search: '',
      hash: '',
    })
  })
})
