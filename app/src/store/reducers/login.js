import * as actionTypes from '../actions/actionTypes';

const initialState = {
	username : '',
	password : '',
	loading: false,
	failed : false,
	success : false,
	externalRedirect : false
}

const reducer = (state = initialState, action) => {

	switch (action.type) {
		case actionTypes.LOGIN:
			return {
				...state,
				username: action.data.username,
				password: action.data.password,
				loading: true,
				failed: false
			}
		case actionTypes.LOGIN_FAILED:
			return {
				...state,
				password: '',
				loading: false,
				failed: action.err,
				success: false
			}
		case actionTypes.LOGIN_SUCCESS:
			return {
				...state,
				password: '',
				loading: false,
				success: true,
				failed: false
			}
		case actionTypes.LOGIN_RESET:
			return {
				...state,
				username: '',
				password: '',
				loading: false,
				failed: false,
				success: false,
				externalRedirect: false
			}
		case actionTypes.EXTERNAL_SUCCESS:
			return {
				...state,
				externalRedirect: true
			}
		default:
			return state;
	}
}

export default reducer;
