import { put } from 'redux-saga/effects';
import axios from 'axios';

import * as actionTypes from '../actions/actionTypes';

import * as config from '../../config'

export function* signUpSaga(action) {
	const data = yield new FormData();
	yield put({
		type: actionTypes.SIGNUP,
		data: action.data
	});
	if (!action.data.name || !action.data.firstname || !action.data.email || !action.data.username || !action.data.password || !action.data.confirmation || !document.getElementById('signupImg').files[0]) {
		yield put({
			type: actionTypes.SIGNUP_FAILED,
			err: "Veuillez renseigner tous les champs"
		});
	} else if (action.data.password !== action.data.confirmation) {
		yield put({
			type: actionTypes.SIGNUP_FAILED,
			err: "Le mot de passe et sa confirmation ne correspondent pas"
		});
	} else {
		data.append('lastName', action.data.name);
		data.append('firstName', action.data.firstname);
		data.append('username', action.data.username);
		data.append('email', action.data.email);
		data.append('password', action.data.password);
		data.append('avatar', document.getElementById('signupImg').files[0]);
		try {
			const user = yield axios.post(config.api_url+'/user', data);
			const tokenList = yield user.data.tokens.reverse();
			yield put({
				type : actionTypes.SIGNUP_SUCCESS
			});
			yield put({
				type : actionTypes.LOG_USER_IN,
				user : user.data
			});
			yield put({
				type : actionTypes.LOGIN_LOCAL,
				token : tokenList[0].token
			});
		} catch (e) {
			yield put({
				type: actionTypes.SIGNUP_FAILED,
				err: (e.response)?e.response.data.toString():e.toString()
			});
		}
	}
}
