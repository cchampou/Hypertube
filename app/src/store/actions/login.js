
import * as actionTypes from './actionTypes'

export const login = (data) => {
	return {
		type : actionTypes.LOGIN_PROCESS,
		data : data
	}
}

export const loginSuccess = () => {
	return {
		type : actionTypes.LOGIN_SUCCESS
	}
}

export const loginFailed = () => {
	return {
		type : actionTypes.LOGIN_FAILED
	}
}

export const loginReset = () => {
	return {
		type : actionTypes.LOGIN_RESET
	}
}
