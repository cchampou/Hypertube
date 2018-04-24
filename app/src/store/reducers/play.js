import * as actionTypes from '../actions/actionTypes'

const initialState = {
	comment : '',
	commentLoading : false,
	success : false,
	fail : false
}

const reducer = ( state = initialState, action ) => {
	switch (action.type) {
		case actionTypes.RESET_COMMENT:
			return {
				...state,
				commentLoading : false,
				comment : '',
				success : false,
				fail : false
			}
		case actionTypes.POST_COMMENT:
			return {
				...state,
				commentLoading : true,
				comment : action.comment,
				success : false,
				fail : false
			}
		case actionTypes.POST_COMMENT_SUCCESS:
			return {
				...state,
				commentLoading : false,
				comment : '',
				fail : false,
				success : true
			}
		case actionTypes.POST_COMMENT_FAILED:
			return {
				...state,
				commentLoading: false,
				success : false,
				fail : true
			}
		default:
			return {
				...state
			}
	}
}

export default reducer;
