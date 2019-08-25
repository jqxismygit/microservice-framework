/* eslint-disable */
import PageA from './pages/pageA'
import reducer from './redux/reducer'
import { combineReducers } from 'redux'
export const pages = {
  pageA: PageA,
}

export const initialize = async store => {
  console.log('模块第一次被加载的时候会自动调用此方法哦，用于模块初始化');
}

export const reducers = combineReducers({
  info: reducer
})
