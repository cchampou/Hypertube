
import * as actionTypes from './actionTypes';


export const resetPassSuccess = () => {
	return {
		type: actionTypes.RESET_PASS_SUCCESS
	}
}

export const resetPassFailed = (error) => {
	return {
		type: actionTypes.RESET_PASS_FAILED,
		error: error
	}
}

export const resetPassReset = () => {
	return {
		type: actionTypes.RESET_PASS_RESET
	}
}
