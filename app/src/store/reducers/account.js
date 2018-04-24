
import * as actionTypes from '../actions/actionTypes'

const initialState = {
	newUsername : '',
	newEmail : '',
	newPassword : '',
	newConfirmation : '',
	loading : false,
	success : false,
	fail : false
}



const reducer = ( state = initialState, action ) => {
	switch (action.type) {
		case actionTypes.RESET_ACCOUNT:
			return {
				...state,
				newUsername : '',
				newEmail : '',
				newPassword : '',
				newConfirmation : '',
				success : false,
				fail : false,
				loading : false
			}

		case actionTypes.POST_ACCOUNT:
			return {
				...state,
				loading : true,
				newUsername : action.data.newUsername,
				newEmail : action.data.newEmail,
				newPassword : action.data.newPassword,
				newConfirmation : action.data.newConfirmation,
				fail : false,
				success : false
			}

		case actionTypes.ACCOUNT_FAILED:
			return {
				...state,
				loading : false,
				success : false,
				fail : action.err,
				newPassword : '',
				newConfirmation : ''
			}

		case actionTypes.ACCOUNT_SUCCESS:
			return {
				...state,
				loading : false,
				success : true,
				fail : false,
				newUsername : '',
				newEmail : '',
				newPassword : '',
				newConfirmation : ''
			}

		default:
			return {
				...state
			}
	}
}

export default reducer;
