
import * as actionTypes from './actionTypes'

export const signupProcess = (data) => {
	return {
		type : actionTypes.SIGNUP_PROCESS,
		data : data
	}
}

export const reset = () => {
	return {
		type : actionTypes.SIGNUP_RESET
	}
}
