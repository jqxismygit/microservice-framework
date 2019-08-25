/* eslint-disable */
import React from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import { injectAsyncReducer } from './store'
import api, * as apis from './store/apis'

// componentDidCatch(err) {
//   document.body.innerHTML = `
//     <div class="modal-loader-error">
//       <div class="modal-loader-error-title">出错了</div>
//       <div class="modal-loader-error-message">${err.message}</div>
//       <a class="modal-loader-error-btn" onClick="javascript:location.reload()">重试</a>
//     </div>
//   `
// }

function loadPkgFile(pkg) {
  return new Promise((resolve, reject) => {
    // console.log(/^http/i.test(pkg.url))
    const assetPrefix = /^http/i.test(pkg.url) ? '' : (process.env.NODE_ENV === 'production' ? '此处填写线上发布地址': '/_modules')
    const cssLink = document.createElement('link')
    cssLink.setAttribute('rel', 'stylesheet')
    cssLink.setAttribute('href', assetPrefix + pkg.url.replace(/\.js$/, '.css'))

    const pkgScript = document.createElement('script')
    pkgScript.setAttribute('src', assetPrefix + pkg.url)
    pkgScript.setAttribute('async', true)
    pkgScript.setAttribute('onload', `eCatalog.pkgWatcher['${pkg.id}-onload']()`)
    pkgScript.setAttribute('onerror', `eCatalog.pkgWatcher['${pkg.id}-onerror']()`)

    eCatalog.pkgWatcher = eCatalog.pkgWatcher || {}
    eCatalog.pkgWatcher[`${pkg.id}-onload`] = resolve
    eCatalog.pkgWatcher[`${pkg.id}-onerror`] = reject

    document.body.appendChild(cssLink)
    document.body.appendChild(pkgScript)
  })
}

function mapModulesRouter(_module, store) {
  const pkg = eCatalog.packages[_module.package.id]

  return _module.router.map((r, i) => {
    const pagePath = r.route.replace(/(?:\$\{)(\S+)(?:\})/, (_match, _var) => {
      let variable = ''

      try {
        variable = _module.config.general.router[_var]
      } catch(e) {}

      return variable
    })

    const Page = pkg.pages && pkg.pages[r.page]
    return (
      <Route path={pagePath} key={i} exact render={props => {
        if (typeof Page !== 'function') {
          return (<div style={{color: 'red'}}>模块页面不存在</div>)
        }
        return React.createElement(Page, {
            module: _module,
            api,
            apis,
            getState: state => state[_module.id],
            ...props,
            ...eCatalog.app
          })
        }}/>
    )
  })
}

function moduleHoc(_module, store) {
  let moduleRouters

  return class extends React.Component {
    static displayName = `moduleHoc(${_module.package.id})`

    componentDidMount() {
      if (!eCatalog.packages[_module.package.id]) {
        loadPkgFile(_module.package)
          .then(this.initModule.bind(this))
          .catch(() => {
            // TODO 模块不存、加载失败在提示
          })
      }
      if (eCatalog.packages[_module.package.id] && !_module.initialized) {
        this.initModule()
      }
    }

    initModule() {
      const pkg = eCatalog.packages[_module.package.id]

      if (pkg.reducers) {
        injectAsyncReducer(store, _module.id, pkg.reducers)
      }

      moduleRouters = mapModulesRouter(_module, store)

      if (typeof pkg.initialize !== 'function') {
        _module.initialized = true
        this.forceUpdate.apply(this)
      } else {
        if (!_module.initialized) {
          pkg.initialize(store).then(() => {
            _module.initialized = true
            setTimeout(this.forceUpdate.bind(this), 0)
          })
        }
      }
    }

    render() {
      if (!eCatalog.packages[_module.package.id] || !_module.initialized) {
        return (
          <div className="module-loader-wrap">
            <div className="module-loader">
              <div className="sk-folding-cube">
                <div className="sk-cube1 sk-cube"></div>
                <div className="sk-cube2 sk-cube"></div>
                <div className="sk-cube4 sk-cube"></div>
                <div className="sk-cube3 sk-cube"></div>
              </div>
              <div className="module-loader-message">初始化模块中 ...</div>
            </div>
          </div>
        )
      }
      return (
        <Switch>
          { moduleRouters }
        </Switch>
      )
    }
  }
}

export default (store) => {
  return eCatalog.app.modules.map((_module, idx) => {
    const prefix = _module.config.general.router.prefix
    return (
      <Route
        path={`/${prefix.replace('/', '')}`}
        exact={prefix==='/'}
        name={idx}
        key={idx}
        component={moduleHoc(_module, store)}/>
    )
  })
}
