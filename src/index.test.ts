import History from '.'
import {autorun} from 'mobx'

let history = new History()

function resetHistory (url = '/', locale?) {
  history.destructor()
  window.history.pushState({}, null, url)
  history = new History(locale)
}

describe('mobx-history', () => {
  describe('constructor', () => {
    it('constructor', () => {
      resetHistory('/')

      expect(history.url).toEqual('/')
      expect(history.locale).toEqual('')
      expect(history.localUrl).toEqual('/')
      expect(location.pathname).toEqual('/')
    })
    it('constructor locale', () => {
      resetHistory('/ru', 'ru')

      expect(history.url).toEqual('/')
      expect(history.locale).toEqual('ru')
      expect(history.localUrl).toEqual('/ru')
      expect(location.pathname).toEqual('/ru')
    })
    it('constructor locales', () => {
      resetHistory('/ru', 'ru|en')

      expect(history.url).toEqual('/')
      expect(history.locale).toEqual('ru')
      expect(history.localUrl).toEqual('/ru')
      expect(location.pathname).toEqual('/ru')

      resetHistory('/fr', 'ru|en')

      expect(history.url).toEqual('/fr')
      expect(history.locale).toEqual('')
      expect(history.localUrl).toEqual('/fr')
      expect(location.pathname).toEqual('/fr')
    })
  })
  it('url', () => {
    resetHistory('/')
    expect(location.pathname).toBe('/')
    expect(history.url).toBe('/')
  })
  it('state', () => {
    resetHistory('/')
    expect(history.state).toEqual({
      key: 'mobx-history-api v1.1',
      steps: []
    })
    expect(history.state).not.toBe(window.history.state)
  })
  describe('push', () => {
    it('simple', () => {
      resetHistory('/')
      const urlLog = []
      const stateLog = []

      history.push('/test')
      expect(history.state).toBe(window.history.state)
      expect(location.pathname).toBe('/test')

      autorun(() => urlLog.push(history.url))
      autorun(() => stateLog.push(history.state))

      expect(history.url).toBe('/test')
      expect(urlLog.length).toBe(1)
      expect(urlLog).toEqual(['/test'])
      expect(stateLog.length).toBe(1)
      expect(stateLog).toEqual([{
        key: 'mobx-history-api v1.1',
        steps: [{
          position: 0,
          url: '/'
        }]
      }])

      history.push('/')

      expect(location.pathname).toBe('/')
      expect(history.url).toBe('/')
      expect(urlLog.length).toBe(2)
      expect(urlLog).toEqual(['/test', '/'])
      expect(stateLog.length).toBe(2)
      expect(stateLog).toEqual([{
        key: 'mobx-history-api v1.1',
        steps: [{
          position: 0,
          url: '/'
        }]
      }, {
        key: 'mobx-history-api v1.1',
        steps: [
          {
            position: 0,
            url: '/'
          }, {
            position: 0,
            url: '/test'
          }
        ]
      }])
    })
    it('same url', () => {
      const {length} = history.state.steps
      history.push('/')
      expect(history.state.steps.length).toBe(length)
    })
  })
  describe('scroll', () => {
    it('simple', () => {
      history.scroll(100)
      expect(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0).toBe(100)
      history.push('/scroll')
      expect(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0).toBe(0)
      expect(history.state).toEqual({
        key: 'mobx-history-api v1.1',
        steps: [{
          position: 0,
          url: '/'
        }, {
          position: 0,
          url: '/test'
        }, {
          position: 100,
          url: '/'
        }]
      })
    })
    it('same url', () => {
      history.scroll(100)
      let position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      expect(position).toBe(100)
      history.push(history.url)
      position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      expect(position).toBe(0)
    })
    it('scrollTo fake element', () => {
      history.scroll(100)
      let position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      expect(position).toBe(100)

      history.scroll('#test')

      position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      expect(position).toBe(0)
    })
  })
  describe('back', () => {
    it('regex', () => {
      history.push('/test', 100)
      let position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      expect(position).toBe(100)
      history.push('/')
      history.push('/?test=1')
      position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      expect(position).toBe(0)
      history.back(/^\/test$/)
      position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      expect(history.url).toBe('/test')
      expect(position).toBe(100)
    })
    it('function', () => {
      expect(history.url).toBe('/test')
      history.push('/test1')
      expect(history.url).toBe('/test1')
      history.push('/test2')
      expect(history.url).toBe('/test2')
      history.back(url => url === '/test')
      expect(history.url).toBe('/test')
    })
    it('position', () => {
      resetHistory('/')
      history.scroll(100)
      expect(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0).toBe(100)
      history.push('/test')
      expect(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0).toBe(0)
      history.back(() => true)
      expect(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0).toBe(100)
    })
  })
  it('path', () => {
    const result = []

    history.push('/test')

    autorun(() => result.push(history.path))

    expect(history.path).toBe('/test')
    expect(result.length).toBe(1)
    expect(result[0]).toBe('/test')

    history.push('/test?key=1')

    expect(history.path).toBe('/test')
    expect(result.length).toBe(1)
    expect(result[0]).toBe('/test')

    history.push('/test#hash')

    expect(history.path).toBe('/test')
    expect(result.length).toBe(1)
    expect(result[0]).toBe('/test')

    history.push('/test?key=1#hash')

    expect(history.path).toBe('/test')
    expect(result.length).toBe(1)
    expect(result[0]).toBe('/test')

    history.push('/test/1')

    expect(history.path).toBe('/test/1')
    expect(result.length).toBe(2)
    expect(result[1]).toBe('/test/1')
  })
  it('search', () => {
    const result = []

    history.push('/test?key=1')


    autorun(() => result.push(history.search('key')))

    expect(history.search('key')).toBe('1')
    expect(result.length).toBe(1)
    expect(result[0]).toBe('1')

    history.push('/test?key=1&value=1')

    expect(history.search('key')).toBe('1')
    expect(history.search('value')).toBe('1')
    expect(result.length).toBe(1)

    history.push('/test?key=2#hash')

    expect(history.search('key')).toBe('2')
    expect(result.length).toBe(2)
    expect(result[1]).toBe('2')

    history.push('/test?key=2&key=1')

    expect(history.search('key')).toBe('1')
    expect(result.length).toBe(3)
    expect(result[2]).toBe('1')

    history.push('/test?key=2&key=1#hash')

    expect(history.search('key')).toBe('1')
    expect(result.length).toBe(3)

    history.push('/test?key=0&key=1#hash')

    expect(history.search('key')).toBe('1')
    expect(result.length).toBe(3)

    history.push('/test?key=0&key=3#hash')

    expect(history.search('key')).toBe('3')
    expect(result.length).toBe(4)
    expect(result[3]).toBe('3')
  })
  describe('hash', () => {
    it('simple', () => {
      const result = []

      history.push('/test#test1')

      autorun(() => result.push(history.hash))

      expect(history.hash).toBe('test1')
      expect(result.length).toBe(1)
      expect(result[0]).toBe('test1')

      history.push('#test2')

      expect(history.hash).toBe('test2')
      expect(result.length).toBe(2)
      expect(result[1]).toBe('test2')

      history.push('?key=1#test2')

      expect(history.hash).toBe('test2')
      expect(result.length).toBe(2)
    })
    it('without hash', () => {
      history.replace('/test?test1=test2')
      expect(history.hash).toBe('')
    })
  })
  it('href', () => {
    const result = []

    history.push('/test#test1')

    autorun(() => result.push(history.href))

    expect(history.href).toEqual('/test')
    expect(result.length).toBe(1)
    expect(result[0]).toBe('/test')

    history.push('/test?key=1')

    expect(history.href).toEqual('/test?key=1')
    expect(result.length).toBe(2)
    expect(result[1]).toBe('/test?key=1')

    history.push('/test?key=1#test')

    expect(history.href).toEqual('/test?key=1')
    expect(result.length).toBe(2)
  })
  it('is', () => {
    const allUsers = []
    const user = []

    history.push('/user')

    autorun(() => allUsers.push(history.is('^/user/?$')))
    autorun(() => user.push(history.is('^/user/([0-9]+)/?')))

    expect(allUsers.length).toEqual(1)
    expect(allUsers[0]).toEqual(true)
    expect(user.length).toEqual(1)
    expect(user[0]).toEqual(false)

    history.push('/user/')

    expect(allUsers.length).toEqual(1)
    expect(user.length).toEqual(1)

    history.push('/user/13')

    expect(allUsers.length).toEqual(2)
    expect(allUsers[1]).toEqual(false)
    expect(user.length).toEqual(2)
    expect(user[1]).toEqual(true)
  })
  it('get', () => {
    const allUsers = []
    const user = []

    history.push('/user')

    autorun(() => allUsers.push(history.get('^/user/?$')))
    autorun(() => user.push(history.get('^/user/(\\d+)/?', 1)))

    expect(allUsers.length).toEqual(1)
    expect(allUsers[0]).toEqual('/user')
    expect(user.length).toEqual(1)
    expect(user[0]).toEqual('')

    history.push('/user/')

    expect(allUsers.length).toEqual(2)
    expect(allUsers[1]).toEqual('/user/')
    expect(user.length).toEqual(1)

    history.push('/user/13')

    expect(allUsers.length).toEqual(3)
    expect(allUsers[2]).toEqual('')
    expect(user.length).toEqual(2)
    expect(user[1]).toEqual('13')
  })
  describe('locale', () => {
    it('simple', () => {
      resetHistory('/user', 'ru')

      expect(history.url).toBe('/user')
      expect(location.pathname).toBe('/user')

      history.locale = 'ru'

      expect(history.url).toBe('/user')
      expect(location.pathname).toBe('/ru/user')

      history.push('/test')

      expect(location.pathname).toBe('/ru/test')
      expect(history.url).toBe('/test')
    })
    it('autorun of url', () => {
      resetHistory('/test', 'ru')
      let count = 0
      const log = []
      autorun(() => log.push([count++, history.url]))

      expect(count).toBe(1)
      expect(log).toEqual([[0, '/test']])

      history.locale = 'ru'
      expect(count).toBe(1)
    })
    it('without slash', () => {
      resetHistory('/', 'ru')
      history.locale = 'ru'
      expect(location.pathname).toBe('/ru')
      history.push('/test')
      expect(location.pathname).toBe('/ru/test')
      history.push('/')
      expect(location.pathname).toBe('/ru')
    })
    it('remove locale', () => {
      resetHistory('/', 'ru')
      history.locale = 'ru'
      expect(location.pathname).toBe('/ru')
      history.locale = ''
      expect(location.pathname).toBe('/')
    })
    it('remove locales', () => {
      resetHistory('/', 'ru')
      history.locale = 'ru'
      expect(history.url).toBe('/')
      expect(location.pathname).toBe('/ru')
      history.locales = ''
      expect(history.url).toBe('/ru')
      expect(location.pathname).toBe('/ru')
    })
  })
  describe('locales', () => {
    it('simple', () => {
      resetHistory('/ru')
      expect(history.locale).toBe('')
      expect(history.url).toBe('/ru')
      history.locales = 'ru'
      expect(history.locale).toBe('ru')
      expect(history.url).toBe('/')
    })
  })
  it('replace', () => {
    resetHistory('/')

    expect(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0).toBe(0)
    expect(history.url).toBe('/')

    history.replace('/test', 100)

    expect(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0).toBe(100)
    expect(history.url).toBe('/test')
    history.replace('/')

    expect(history.url).toBe('/')

    expect(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0).toBe(0)
  })
})
