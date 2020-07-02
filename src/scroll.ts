type ScrollCallback = () => any | void

function scroll (position: number | string, callback?: ScrollCallback): void {
  if (callback) {
    let top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    scroll(position)
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
      scroll(0)
    }
  } else if (position > -1) {
    const top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    if (top !== position) {
      document.documentElement.scrollTop = document.body.scrollTop = position
    }
  }
}

export default scroll
