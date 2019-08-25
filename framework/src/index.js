/* eslint-disable */
import React from 'react'
import _ from 'lodash'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import configureStore from './store'
import getRouter from './getRouter'
import * as apis from './store/apis'
import './index.css'

// Preload Dependencies
require('prop-types')
require('classnames')
require('moment')
require('lodash')
require('qs')
require('urijs')
require('normalizr')
window.$ = require('jquery')

const preloadedState = window.__PRELOADED_STATE__
const store = configureStore(preloadedState)

if (process.env.NODE_ENV === 'production' && module.hot) {
  module.hot.accept()
}

const getApp = domain => {
  return apis.getAppConfig(domain).then(result => {
    eCatalog.app = result.data
  }).catch(error => {
    if (error.response && error.response.status === 404) {
      document.body.innerHTML = `
        <div class="empty-page">
          <div class="tenant-404">
            <h1 class="tenant-404-icon">404</h1>
            <div class="tenant-404-msg">出错了</div>
          </div>
        </div>
      `
    }

    throw error // NOTE 跳过 bootstrap 继续执行
  })
}

window.bootstrap = async domain => {
  await getApp(domain)
  const Layout = eCatalog.packages[eCatalog.app.layout.package.id].default
  const routers = getRouter(store)
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <div id="app-container">
          <Layout>
            <Switch>
              { routers }
              <Route path="*" render={() => (
                <div className="empty-page">
                  <div className="tenant-404">
                    <h1 className="tenant-404-icon">404</h1>
                    <div className="tenant-404-msg">当前页面不存在</div>
                    <Link className="tenant-404-btn" replace to="/">返回首页</Link>
                  </div>
                </div>
              )} />
            </Switch>
          </Layout>
        </div>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  )
}
