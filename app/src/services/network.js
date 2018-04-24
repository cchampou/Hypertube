import axios from 'axios';
import * as config from '../config.js';

export const publicRequest = axios.create({
	baseURL: config.api_url
});

export const authRequest = (endpoint, method, data = {}) => {
	return new Promise(async (resolve, reject) => {
		try {
			const token = await localStorage.getItem('token');
			if (token) {
				const res = await axios({
					url : config.api_url+endpoint,
					method : method,
					data,
					headers : {
						'x-auth' : token
					}
				});
				resolve(res);
			}
			resolve();
		} catch (e) {
			reject(e);
		}

	});
}