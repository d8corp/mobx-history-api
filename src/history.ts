import {action, computed, observable, IComputedValue} from 'mobx'
import scroll from './scroll'

type Step = {
  url: string
  position: number
}
type Steps = Step[]
type State = {
  key: string
  steps: Steps
}
type ScrollCallback = () => any | void
type BackChk = (url: string) => boolean

class History {
  constructor (locales: string = '', key = 'mobx-history-api v1.1') {
    this.locales = locales
    this.key = key
    this.defaultState = {
      key,
      steps: []
    }

    const {state} = window.history
    if (state?.key === key) {
      this.state = state
    } else {
      this.state = this.defaultState
    }

    const listener = ({state}) => this.onChange(state)
    window.addEventListener('popstate', listener)
    this.destructor = () => window.removeEventListener('popstate', listener)
  }

  public readonly destructor: () => void
  protected readonly defaultState: State
  protected readonly key: string

  protected getCache: {[reg: number]: {[index: string]: IComputedValue<string>}}
  protected isCache: {[reg: string]: IComputedValue<boolean>}

  @observable.ref public movement: 'back' | 'forward' | undefined
  @observable.ref public state: State
  @observable.ref public locales: string
  @observable.ref protected _url: string = location.pathname + location.search + location.hash

  @action protected onChange (state: State) {
    const {pathname, search, hash} = location
    const oldState = this.state
    this.state = state && this.key === state.key ? state : this.defaultState
    this._url = pathname + search + hash
    if (!state || this.key !== state.key || (oldState && this.key === oldState.key && oldState.steps.length > state.steps.length)) {
      this.movement = 'back'
    } else {
      this.movement = 'forward'
    }
  }

  @computed public get locale (): string {
    const {locales} = this
    if (locales) {
      const match = this._url.match(new RegExp(`^/(${locales})(/|\\?|#|$)`))
      return match ? match[1] : ''
    }
    return ''
  }
  public set locale (locale: string) {
    const {locales, locale: currentLocale} = this
    if (locales && locale !== currentLocale && (!locale || new RegExp(`^(${locales})$`).test(locale))) {
      const {url, state: {steps}} = this
      const position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      this.changeState(newUrl => {
        window.history.pushState({
          key: this.key,
          steps: [...steps, {
            url,
            position
          }]
        }, null, newUrl)
      }, locale, url, -1)
    }
  }
  public get localUrl (): string {
    return this._url
  }

  @computed public get url (): string {
    const {locales, _url} = this
    return locales ? _url.replace(new RegExp(`^/(${locales})((/)|(\\?|#|$))`), '/$4') : _url
  }
  @computed public get path (): string {
    return this.url.replace(/[?#].*/, '')
  }
  @computed public get hash (): string {
    const math = this.url.match(/^[^#]*#(.+)/)
    return math ? math[1] : ''
  }
  @computed public get href (): string {
    return this.url.replace(/#.*/, '')
  }
  public search (key: string): string {
    return this.get(`^[^?#]*\\?([^#]*\\&)*${key}=([^#&]*)`, 2)
  }

  public back (is?: RegExp | BackChk, def = '/', scrollFirst = false): this {
    if (is) {
      if (typeof is !== 'function') {
        const regexp = is
        is = url => regexp.test(url)
      }
      const {steps} = this.state
      for (let i = steps.length - 1; i > -1; i--) {
        const step = steps[i]
        if (is(step.url)) {
          return this.push(step.url, step.position, scrollFirst)
        }
      }
      this.push(def, 0, scrollFirst)
    } else if (scrollFirst) {
      const {steps} = this.state
      scroll(steps[steps.length - 1].position, () => window.history.back())
    } else {
      window.history.back()
    }
    return this
  }
  public forward (): this {
    window.history.forward()
    return this
  }
  public go (delta: number): this {
    window.history.go(delta)
    return this
  }
  public replace (url: string, position: number | string = 0, scrollFirst = false): this {
    this.changeState(newUrl => {
      window.history.replaceState(this.state, null, newUrl)
    }, this.locale, url, position, scrollFirst)
    return this
  }
  public push (url: string, position: number | string = 0, scrollFirst = false): this {
    const {url: currentUrl, state: {steps}} = this
    const top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    this.changeState(newUrl => {
      if (currentUrl !== url) {
        window.history.pushState({
          key: this.key,
          steps: [...steps, {
            url: currentUrl,
            position: top
          }]
        }, null, newUrl)
      }
    }, this.locale, url, position, scrollFirst)
    return this
  }
  /** @deprecated - please, use addition function `scroll` from the package */
  public scroll (position: number | string, callback?: ScrollCallback): this {
    scroll(position, callback)
    return this
  }
  public is (reg: string): boolean {
    if (!this.isCache) {
      this.isCache = {}
    }
    if (!this.isCache[reg]) {
      const regExp = new RegExp(reg)
      this.isCache[reg] = computed(() => regExp.test(this.url))
    }
    return this.isCache[reg].get()
  }
  public get (reg: string, index = 0, defaultValue = ''): string {
    if (!this.getCache) {
      this.getCache = {}
    }
    if (!this.getCache[index]) {
      this.getCache[index] = {}
    }
    if (!this.getCache[index][reg]) {
      const regExp = new RegExp(reg)
      this.getCache[index][reg] = computed(() => {
        const result = regExp.exec(this.url)
        return result ? result[index] || '' : defaultValue
      })
    }
    return this.getCache[index][reg].get()
  }

  protected changeState (callback: (newUrl: string) => void, locale: string, url: string, position: number | string, scrollFirst?: boolean): void {
    const mainCallback = () => {
      if (locale) {
        const match = url.match(/^([^?#]*)(.*)/)
        callback(match[1] === '/' ? `/${locale}${match[2]}` : `/${locale}${url}`)
      } else {
        callback(url)
      }
      this.onChange(window.history.state)
    }
    if (scrollFirst) {
      scroll(position, mainCallback)
    } else {
      mainCallback()
      scroll(position)
    }
  }
}

export default History

export {
  Step,
  Steps,
  State,
  ScrollCallback,
  BackChk
}
