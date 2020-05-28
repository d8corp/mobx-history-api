import History from '.'
import {autorun} from 'mobx'

window.history.pushState({}, null, '/ru')

let history = new History('ru')

function resetHistory (url = '/') {
  history.destructor()
  window.history.pushState({}, null, url)
  history = new History()
}

describe('mobx-history', () => {
  it('constructor locale', () => {
    expect(history.state).not.toBe(window.history.state)
    expect(history.url).toEqual('/')
    expect(history.locale).toEqual('ru')
    expect(location.pathname).toEqual('/ru')
  })
  it('setLocale', () => {
    resetHistory('/ru')
    expect(history.state).not.toBe(window.history.state)
    expect(history.url).toEqual('/ru')
    expect(history.locale).toEqual('')
    expect(location.pathname).toEqual('/ru')

    history.setLocale('ru')

    expect(history.state).toBe(window.history.state)
    expect(history.state.steps.length).toBe(1)
    expect(history.url).toEqual('/')
    expect(history.locale).toEqual('ru')
    expect(location.pathname).toEqual('/ru')
    history.locale = ''
  })
  it('url', () => {
    expect(location.pathname).toBe('/')
    expect(history.url).toBe('/')
  })
  it('state', () => {
    expect(history.state).toEqual({
      key: 'mobx-history-api',
      steps: [{
        locale: '',
        position: 0,
        url: '/'
      }]
    })
    expect(history.state).toBe(window.history.state)
  })
  it('push', () => {
    const urlLog = []
    const stateLog = []

    history.push('/test')
    expect(history.state).toStrictEqual(window.history.state)
    expect(location.pathname).toBe('/test')

    autorun(() => urlLog.push(history.url))
    autorun(() => stateLog.push(history.state))

    expect(history.url).toBe('/test')
    expect(urlLog.length).toBe(1)
    expect(urlLog).toEqual(['/test'])
    expect(stateLog.length).toBe(1)
    expect(stateLog).toEqual([{
      key: 'mobx-history-api',
      steps: [{
        locale: '',
        position: 0,
        url: '/'
      },{
        locale: '',
        position: 0,
        url: '/test'
      }]
    }])

    history.push('/')

    expect(location.pathname).toBe('/')
    expect(history.url).toBe('/')
    expect(urlLog.length).toBe(2)
    expect(urlLog).toEqual(['/test', '/'])
    expect(stateLog.length).toBe(2)
    expect(stateLog).toEqual([{
      key: 'mobx-history-api',
      steps: [{
        locale: '',
        position: 0,
        url: '/'
      }, {
        position: 0,
        locale: '',
        url: '/test'
      }]
    }, {
      key: 'mobx-history-api',
      steps: [
        {
          position: 0,
          locale: '',
          url: '/'
        }, {
          position: 0,
          locale: '',
          url: '/test'
        }, {
          position: 0,
          locale: '',
          url: '/'
        }
      ]
    }])
  })
  it('scroll', () => {
    history.scroll(100)
    let position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    expect(position).toBe(100)
    history.push('/scroll')
    position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    expect(position).toBe(0)
    expect(history.state).toEqual({
      key: 'mobx-history-api',
      steps: [{
        position: 0,
        locale: '',
        url: '/'
      }, {
        position: 0,
        locale: '',
        url: '/test'
      }, {
        position: 100,
        locale: '',
        url: '/'
      }, {
        position: 0,
        locale: '',
        url: '/scroll'
      }]
    })
  })
  it('push back', () => {
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
  it('hash', () => {
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
      history.push('/user')
      expect(history.url).toBe('/user')
      expect(location.pathname).toBe('/user')
      history.locale = 'ru'
      expect(history.url).toBe('/user')
      expect(location.pathname).toBe('/ru/user')
      history.push('/test')
      expect(history.url).toBe('/test')
      expect(location.pathname).toBe('/ru/test')
      expect(history.state.steps[history.state.steps.length - 1]).toEqual({position: 0, locale: 'ru', url: '/test'})
    })
    it('autorun of url', () => {
      let count = 0
      const log = []
      history.locale = ''
      history.push('/test')
      autorun(() => log.push([count++, history.url]))

      expect(count).toBe(1)
      expect(log).toEqual([[0, '/test']])

      history.locale = 'ru'
      expect(count).toBe(1)
    })
    it('without slash', () => {
      history.push('/')
      history.locale = 'ru'
      expect(location.pathname).toBe('/ru')
      history.push('/test')
      expect(location.pathname).toBe('/ru/test')
      history.push('/')
      expect(location.pathname).toBe('/ru')
    })
  })
})
