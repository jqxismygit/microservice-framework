/* eslint-disable */
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createReducer from './reducers'
import api, * as apis from './apis'

const configureStore = (preloadedState) => {
	let middlewares = applyMiddleware(
		thunk.withExtraArgument({ api, apis })
	);

	if (window.__REDUX_DEVTOOLS_EXTENSION__) {
		middlewares = compose(middlewares, window.__REDUX_DEVTOOLS_EXTENSION__());
	}

	const store = createStore(createReducer(), middlewares)
  store.asyncReducers = {};

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./reducers', () => {
			store.replaceReducer(createReducer())
		})
	}

	return store
}

export default configureStore

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}
