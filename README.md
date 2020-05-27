# mobx-history-api
[![NPM](https://img.shields.io/npm/v/mobx-history-api.svg)](https://www.npmjs.com/package/mobx-history-api)
![downloads](https://img.shields.io/npm/dm/mobx-history-api.svg)
![license](https://img.shields.io/npm/l/mobx-history-api)  
Browser History API with [Mobx](https://mobx.js.org/README.html) 3 and more.
### Installation
npm
```bash
npm i mobx-history-api
```
yarn
```bash
yarn add mobx-history-api
```
### Using
To start working with Mobx History API just get an instance of `History`.
```javascript
import History from 'mobx-history-api'

const history = new History()
```
## Fields
### url ![string](https://img.shields.io/badge/-string-green)
This is an observable field, returns current relative URL includes pathname, search and hash.  
```javascript
history.url // current url
```
*`url` does not include locale*
### path ![string](https://img.shields.io/badge/-string-green)
This is an observable field, returns current pathname of URL.  
```javascript
history.path // current pathname
``` 
*`path` does not include locale*
### hash ![string](https://img.shields.io/badge/-string-green)
This is an observable field, returns current hash of URL.  
```javascript
history.hash
```  
### href ![string](https://img.shields.io/badge/-string-green)
This is an observable field, returns current path + search of URL.
```javascript
history.href
```
*`href` does not include locale*
### locale ![string](https://img.shields.io/badge/-string-green)
This is an observable and writable field, returns current locale of URL.
```javascript
history.locale // returns empty string by default
history.push('/test')

history.url = '/test'
location.pathname = '/test'

history.locale = 'ru'

history.url = '/test'
location.pathname = '/ru/test'
```
### movement ![string](https://img.shields.io/badge/-"forvard"-green) ![string](https://img.shields.io/badge/-"back"-green) ![undefined](https://img.shields.io/badge/-undefined-orange)
This is an observable field, returns `undefined` if you just load the page.
When you moved through history the field changes to the status of the moving.  
```javascript
// history.movement === undefined
history.push('/test')
// history.movement === 'forward'
history.back()
// history.movement === 'back'
```
### state ![object](https://img.shields.io/badge/-object-orange)
This is an observable field, returns the state of history api.  
`state` equals `window.history.state` when number of `steps` more than 1.
```javascript
history.state // {key: '...', steps: [{...}]}
history.push('/test')
history.state // {key: '...', steps: [{...}, {...}]}
```
## Methods
### search
This is an observable method.  
That means you can use the method inside `reaction` of `mobx`,
when result of the function changed the `reaction` be called.  

The method returns the value of the provided `key` in the URL query.   
`search(key: string): string`
```javascript
history.search('key') // returns 'value' for url equals '?key=value'
```
### scroll
You can scroll the current page with `scroll` method of history.  
`scroll(position: number | string, callback?: function): this`
```javascript
history.scroll(100)
```
If you wanna scroll the page to a defined element you can provide CSS selector to find the element and scroll to view it.
```javascript
history.scroll('#root')
```
When you use `scroll-behavior` equals `smooth` you can get callback when the scrolling finished.
```javascript
history.scroll(0, () => console.log('scrolling is finished'))
```
### push
You can push to history any URL and you be moved forward in the history.  
`push(url: string, position: number | string = 0, scrollFirst = false): this`
```javascript
history.push('/test')
``` 
By default any time when you push a new URL the page scrolls up to position `0`.
If you wanna custom scroll the page after the pushing you can provide the second argument as a position of scroll.
```javascript
history.push('/test', 200)
history.push('/', '#root')
```
If you do not want to scroll, provide `-1` as a position of scrolling.  
If you wanna scroll first with `scroll-behavior` equals `smooth`, provide `true` to the third argument.
```javascript
history.push('/test', 0, true)
```
### back
You can move back like you click on back button in your browser.  
`back(reg?: RegExp, def = '/', scrollFirst = false): this`
```javascript
history.back()
```
With the method, you can push to history a position which was before.
Just provide an argument to the method.
The argument should be regex to test previous states.
```javascript
history.back(/.*/) // push any previous url
```
The second argument is used when nothing found in history.  
The third argument works the same as the third of `push`.
### go
You can move to any position of history with method `go`.  
`go(delta: number): this`
```javascript
history.go(-1) // the same back()
```
### forward
You can move forward like you click on forward button in your browser.  
`forward(): this`
```javascript
history.forward()
```
### is
This is observable method.
This method just returns result of regex testing which provided to the method.  
`is(reg: string): boolean`
```javascript
history.is('^/$') // true if this is home page
```
The regexp tests `url` field of `history`. That means `is` don't include `locale`.
### get
This method is the same as method `is`, but returns result of matching.  
`get(reg: string, index = 0, defaultValue = ''): string`
```javascript
history.get('^/user/([0-9]+)$')
// returns current url if it matches the regex, otherwise empty string
```
The second argument is used for get information inside round brackets.
```javascript
history.get('^/user/([0-9]+)$', 1)
// returns current user if url matches the regex, otherwise empty string
```
### destructor
If you finished working with history and wanna get rid of it, just run `destructor` method.  
`destructor()`
```javascript
history.destructor()
```
## Utils
### decode
Just decodes URL to string
```javascript
import {decode} from 'mobx-history-api'
decode(location.href)
```
### parseUrl
Returns an object with `path`, `search` and `hash` fields of relative URL
```javascript
import {parseUrl} from 'mobx-history-api'
parseUrl(location.pathname + location.search + location.hash)
```
### setSearch
Sets search value to relative URL
```javascript
import {setSearch} from 'mobx-history-api'
setSearch('/test', 'key', 'value') // "/test?key=value"
```
### removeSearch
Removes search value from relative URL
```javascript
import {removeSearch} from 'mobx-history-api'
removeSearch('/test?key=value', 'key') // "/test"
```
## Example
```javascript
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import History from 'mobx-history-api'
import {observer} from 'mobx-react'

const history = new History()

@observer
class Url extends Component {
  render () {
    return history.url
  }
}

ReactDOM.render(<Url />, document.getElementById('root'))

// render current URL. Let it be '/'

history.push('/test')

// now the root element contains '/test' 
```
### links
- [react-mobx-routing](https://github.com/d8corp/react-mobx-routing) [![NPM](https://img.shields.io/npm/v/react-mobx-routing.svg)](https://www.npmjs.com/package/react-mobx-routing) for React projects. 
## Issues
If you find a bug, please file an issue on [GitHub](https://github.com/d8corp/mobx-history-api/issues)  
[![issues](https://img.shields.io/github/issues-raw/d8corp/mobx-history-api)](https://github.com/d8corp/mobx-history-api/issues)  
> ---
[![stars](https://img.shields.io/github/stars/d8corp/mobx-history-api?style=social)](https://github.com/d8corp/mobx-history-api/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/mobx-history-api?style=social)](https://github.com/d8corp/mobx-history-api/watchers)

