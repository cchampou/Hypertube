
import * as actionTypes from './actionTypes'

export const processAccount = data => ({
	type : actionTypes.PROCESS_ACCOUNT,
	data
})

export const resetAccount = () => ({
	type: actionTypes.RESET_ACCOUNT
})
