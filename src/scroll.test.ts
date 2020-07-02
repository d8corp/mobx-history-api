import scroll from './scroll'

describe('scroll', () => {
  it('simple', () => {
    expect(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0).toBe(0)
    scroll(100)
    expect(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0).toBe(100)
  })
  it('scrollTo fake element', () => {
    scroll(100)
    let position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    expect(position).toBe(100)

    scroll('#test')

    position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    expect(position).toBe(0)
  })
})
