
import * as actionTypes from '../actions/actionTypes'

const initialState = {
	loading: false,
	error: '',
	ok : false
}

export const reducer = (state = initialState, action) => {

	switch (action.type) {
		case actionTypes.RESET_PASS:
			return {
				...state,
				error: '',
				ok : false,
				loading: true
			}
		case actionTypes.RESET_PASS_FAILED:
			return {
				...state,
				loading: false,
				error: action.error
			}
		case actionTypes.RESET_PASS_SUCCESS:
			return {
				...state,
				loading: false,
				error: '',
				ok : true
			}
		case actionTypes.RESET_PASS_RESET:
			return initialState
		default:
			return state
	}
}

export default reducer;
