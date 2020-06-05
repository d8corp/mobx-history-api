import {action, computed, observable, IComputedValue} from 'mobx'

type Step = {
  url: string
  locale: string
  position: number
}
type Steps = Step[]
type State = {
  key: string
  steps: Steps
}
type ScrollCallback = () => any | void
type BackChk = (state: Step) => boolean

class History {
  constructor (locale = '', key = 'mobx-history-api') {
    this.key = key
    this._locale = locale
    const {state} = window.history
    if (state && key === state.key) {
      this.state = state
    } else {
      this.state = this.defaultState
    }
    const listener = ({state}) => this.onChange(state)
    window.addEventListener('popstate', listener)
    this.destructor = () => window.removeEventListener('popstate', listener)
  }

  protected get defaultState (): State {
    const {location} = window
    const locale = this._locale
    let url = location.pathname + location.search + location.hash
    if (locale) {
      url = url.replace(new RegExp(`^/${locale}(/|$)`), '/')
    }
    return {
      key: this.key,
      steps: [{
        locale,
        position: 0,
        url
      }]
    }
  }

  protected readonly key: string

  @observable.ref public movement: 'back' | 'forward' | undefined
  @observable.ref public state: State
  @observable.ref private _locale = ''
  @computed public get locale (): string {
    return this._locale
  }
  public set locale (locale) {
    action(() => {
      this._locale = locale
      const {state} = this
      const lastStep = state.steps[state.steps.length - 1]
      const {url} = lastStep
      this.state = {
        key: this.key,
        steps: [...state.steps.slice(0, -1), {
          ...lastStep,
          locale
        }]
      }
      window.history.replaceState(this.state, null, locale ? '/' + locale + (url === '/' ? '' : url) : url)
    })()
  }

  public readonly destructor: () => void
  protected getCache: {[reg: string]: {[index: number]: IComputedValue<string>}}
  protected isCache: {[reg: string]: IComputedValue<boolean>}
  @action protected onChange (state: State) {
    const oldState = this.state
    this.state = state && this.key === state.key ? state : this.defaultState
    if (!state || this.key !== state.key || (oldState && this.key === oldState.key && oldState.steps.length > state.steps.length)) {
      this.movement = 'back'
    } else {
      this.movement = 'forward'
    }
  }
  @action setLocale (locale = ''): void {
    this._locale = locale
    const {state} = this
    const lastStep = state.steps[state.steps.length - 1]
    let url = location.pathname + location.search + location.hash
    if (locale) {
      url = url.replace(new RegExp(`^/${locale}(/|$)`), '/')
    }
    this.state = {
      key: this.key,
      steps: [...state.steps.slice(0, -1), {
        ...lastStep,
        locale,
        url
      }]
    }
    window.history.replaceState(this.state, null, locale ? '/' + locale + (url === '/' ? '' : url) : url)
  }

  @computed public get url (): string {
    const {steps} = this.state
    return steps[steps.length - 1].url
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

  public back (reg?: RegExp | BackChk, def = '/', scrollFirst = false): this {
    if (reg) {
      if (typeof reg !== 'function') {
        const regexp = reg
        reg = step => regexp.test(step.url)
      }
      const {steps} = this.state
      for (let i = steps.length - 1; i > -1; i--) {
        const step = steps[i]
        if (reg(step)) {
          return this.push(step.url, step.position, scrollFirst)
        }
      }
      this.push(def, 0, scrollFirst)
    } else if (scrollFirst) {
      const {steps} = this.state
      this.scroll(steps[steps.length - 1].position, () => window.history.back())
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
  protected changeState (callback: (newUrl: string) => void, url: string, position: number | string, scrollFirst: boolean): void {
    const {locale} = this
    const mainCallback = () => {
      callback(locale ? '/' + locale + (url === '/' ? '' : url) : url)
      this.onChange(window.history.state)
    }
    if (scrollFirst) {
      this.scroll(position, mainCallback)
    } else {
      mainCallback()
      this.scroll(position)
    }
  }
  public replace (url: string, position: number | string = 0, scrollFirst = false): this {
    const {locale} = this
    const {steps} = this.state
    this.changeState(newUrl => {
      window.history.replaceState({
        key: this.key,
        steps: [...steps.slice(0, -1), {
          locale,
          url,
          position: position > -1 ? position : steps[steps.length - 1].position
        }]
      } as State, null, newUrl)
    }, url, position, scrollFirst)
    return this
  }
  public push (url: string, position: number | string = 0, scrollFirst = false): this {
    const {locale, url: currentUrl} = this
    const {steps} = this.state
    const top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    steps[steps.length - 1].position = top
    this.changeState(newUrl => {
      if (currentUrl !== url) {
        window.history.pushState({
          key: this.key,
          steps: [...steps, {
            locale,
            url,
            position: position > -1 ? position : top
          }]
        } as State, null, newUrl)
      }
    }, url, position, scrollFirst)
    return this
  }
  public scroll (position: number | string, callback?: ScrollCallback): this {
    if (callback) {
      let top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      this.scroll(position)
      let count = 0
      const interval = setInterval(() => {
        const currentTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        if (currentTop === top || count++ === 30) {
          clearInterval(interval)
          callback()
        } else {
          top = currentTop
        }
      }, 100)
    } else if (typeof position === 'string') {
      const element = document.querySelector(position)
      if (element) {
        element.scrollIntoView()
      } else {
        this.scroll(0)
      }
    } else if (position > -1) {
      const top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      if (top !== position) {
        document.documentElement.scrollTop = document.body.scrollTop = position
      }
    }
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
    if (!this.getCache[reg]) {
      this.getCache[reg] = {}
    }
    if (!this.getCache[reg][index]) {
      const regExp = new RegExp(reg)
      this.getCache[reg][index] = computed(() => {
        const result = regExp.exec(this.url)
        return result ? result[index] || '' : defaultValue
      })
    }
    return this.getCache[reg][index].get()
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
