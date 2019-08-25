module.exports = {
	'react': {
		global: 'React',
		script: {
			dev: 'react/umd/react.development.js',
			prod: 'react/umd/react.production.min.js'
		}
	},
	'react-dom': {
		global: 'ReactDOM',
		script: {
			dev: 'react-dom/umd/react-dom.development.js',
			prod: 'react-dom/umd/react-dom.production.min.js'
		}
	},
	'react-router-dom': {
		global: 'ReactRouterDOM',
		script: {
			dev: 'react-router-dom/umd/react-router-dom.js',
			prod: 'react-router-dom/umd/react-router-dom.min.js'
		}
	},
	'redux': {
		global: 'Redux',
		script: {
			dev: 'redux/dist/redux.js',
			prod: 'redux/dist/redux.min.js'
		}
	},
	'react-redux': {
		global: 'ReactRedux',
		script: {
			dev: 'react-redux/dist/react-redux.js',
			prod: 'react-redux/dist/react-redux.min.js'
		}
	},
	'prop-types': {
		global: 'ReactPropTypes',
		script: {
			dev: 'prop-types/prop-types.js',
			prod: 'prop-types/prop-types.min.js'
		}
	},
	'classnames': {
		global: 'classNames',
		script: {
			dev: 'classnames/index.js',
			prod: 'classnames/index.js'
		}
	},
  'moment': {
    global: 'moment',
		script: {
			dev: 'moment/moment.js',
			prod: 'moment/moment.js'
		}
  },
  'lodash': {
    global: '_',
		script: {
			dev: 'lodash/lodash.js',
			prod: 'lodash/lodash.min.js'
		}
  },
  'jquery': {
    global: 'jQuery',
		script: {
			dev: 'jquery/dist/jquery.js',
			prod: 'jquery/dist/jquery.js'
		}
  },
  'qs': {
    global: 'Qs',
		script: {
			dev: 'qs/dist/qs.js',
			prod: 'qs/dist/qs.js'
		}
  },
  'urijs': {
    global: 'URI',
		script: {
			dev: 'urijs/src/URI.js',
			prod: 'urijs/src/URI.js'
		}
  },
  'normalizr': {
    global: 'normalizr',
		script: {
			dev: 'normalizr/dist/normalizr.umd.js',
			prod: 'normalizr/dist/normalizr.umd.js'
		}
  }
}
