/* eslint-disable */
// TODO: AUTHORIZATION
import axios from 'axios'
import qs from 'qs'

const api = axios.create({
	baseURL: window.API_URL,
	responseType: 'json'
});

api.interceptors.request.use(config => {
	let token
	try {
		token = localStorage.getItem('orbit:token')
		config.headers['Authorization'] = 'Bearer ' + token
	} catch (e) {}

	return config
})

api.interceptors.response.use(response => response, error => {
	// Do something with response error
	if (error.response && error.response.status && error.response.status === 401) {
    localStorage.removeItem('orbit:token')
  }

	return Promise.reject(error);
})

export default api

export const getAppConfig = domain => {
	let baseURL = '/'
	let jsonURL = process.env.NODE_ENV === 'production' ? '/app.json' : '/app_dev.json'
	const query = qs.parse(location.search.slice(1))

	if (query.json) {
		jsonURL = query.json
		baseURL = /^http/.test(query.json) ? null : '/'
	}

	return api.get(jsonURL, { responseType: 'json', baseURL })
}
