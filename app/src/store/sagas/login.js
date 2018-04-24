import { put } from 'redux-saga/effects';
import axios from 'axios';

import * as config from '../../config.js';

import { authRequest } from '../../services/network';

import * as actionTypes from '../actions/actionTypes'

export function* resetPassSaga(action) {
	yield put({
		type : actionTypes.RESET_PASS
	})
	try {
		yield axios.post(config.api_url+'/user/forget', { email : action.email });
		yield put({
			type : actionTypes.RESET_PASS_SUCCESS
		})
	} catch (err) {
		yield put({
			type : actionTypes.RESET_PASS_FAILED,
			error : 'Cet utilisateur n\'existe pas'
		})
	}
}

export function* newPassSaga(action) {
	yield put({
		type : actionTypes.NEW_PASS_RESET
	})
	if (action.data.password !== action.data.confirmation) {
		yield put({
			type : actionTypes.NEW_PASS_FAILED,
			msg : "Le mot de passe et sa confirmation ne correspondent pas"
		});
	} else {
		try {
			yield axios.post(config.api_url+'/user/reset', {
				password : action.data.password,
				token : action.data.token
			});
			yield put({
				type : actionTypes.NEW_PASS_SUCCESS
			});
		} catch (err) {
			yield put({
				type : actionTypes.NEW_PASS_FAILED,
				msg : err.response.data
			})
		}
	}
}

export function* loginSaga(action) {
	yield put({
		type : actionTypes.LOGIN,
		data : action.data
	});
	if (!action.data || !action.data.username || !action.data.password) {
		yield put({
			type: actionTypes.LOGIN_FAILED,
			err: 'Veuillez renseigner tous les champs'
		});
	} else {
		try {
			const res = yield axios.post(config.api_url+'/auth/local', {
				username : action.data.username,
				password : action.data.password
			});
			const tokenList = yield res.data.tokens.reverse();
			yield put({
				type : actionTypes.LOG_USER_IN,
				user : res.data
			});
			yield put({
				type: actionTypes.LOGIN_LOCAL,
				token: tokenList[0].token
			})
		} catch (err) {
			yield put({
				type : actionTypes.LOGIN_FAILED,
				err: 'Le nom d\'utilisateur ou le mot de passe est incorrect'
			});
		}
	}
}

export function* loginLocal(action) {
	yield localStorage.setItem('token', action.token);
	yield put({
		type : actionTypes.LOGIN_SUCCESS
	});
}

export function* logout(action) {
	yield localStorage.removeItem('token');
	yield put({
		type : actionTypes.LOG_USER_OUT
	});
}

export function* externalLoginSaga(action) {
	try {
		yield put({
			type: actionTypes.LOGIN_LOCAL,
			token: action.token
		})
		const res = yield authRequest('/user/select', 'get');
		yield put({
			type : actionTypes.LOG_USER_IN,
			user : res.data
		});
		yield put({
			type: actionTypes.EXTERNAL_SUCCESS
		});
	} catch (err) {
		console.log(err);
		yield put({
			type : actionTypes.LOGIN_FAILED,
			err: 'Echec de l\'authentification'
		});
	}
}

export function* autoLoginSaga(action) {
	const token = localStorage.getItem('token');
	
	if (token) {
		try {
			const res = yield authRequest('/user/select', 'get');
			yield put({
				type : actionTypes.LOG_USER_IN,
				user : res.data
			});
		} catch (err) {
			console.log(err);
		}
	}
}
