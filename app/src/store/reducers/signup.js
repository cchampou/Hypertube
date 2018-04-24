import * as actionTypes from '../actions/actionTypes';

const initialState = {
	name: '',
	firstname: '',
	email: '',
	username: '',
	password: '',
	confirmation: '',
	loading: false,
	error: ''
}

const reducer = ( state = initialState, action) => {

	switch (action.type) {
		case actionTypes.SIGNUP:
			return {
				...state,
				loading: true,
				error: '',
				name: action.data.name,
				firstname: action.data.firstname,
				email: action.data.email,
				username: action.data.username,
				password: action.data.password,
				confirmation: action.data.confirmation
			}
		case actionTypes.SIGNUP_FAILED:
			return {
				...state,
				error: action.err,
				password: '',
				confirmation: '',
				loading: false
			}
		case actionTypes.SIGNUP_SUCCESS:
			return {
				...state,
				loading: false
			}
		case actionTypes.SIGNUP_RESET:
			return  {
				...state,
				name: '',
				firstname: '',
				email: '',
				username: '',
				password: '',
				confirmation: '',
				loading: false,
				error: ''
			}
		default:
			return state;
	}
}

export default reducer;
