import * as actionTypes from '../actions/actionTypes';

const initialState = {
	isLoggedIn : false,
	username : '',
	email : '',
	seen : [],
	picture : '',
	lang : 'en'
}

const reducer = ( state = initialState, action) => {
	switch (action.type) {
		case actionTypes.LOG_USER_IN:
			return {
				...state,
				isLoggedIn : true,
				username : action.user.username,
				email : action.user.email,
				avatar : action.user.avatar,
				seen : action.user.seen,
				lang : (action.user.language === 'french')?'fr':'en'
			}
		case actionTypes.LOG_USER_OUT:
			return {
				...state,
				isLoggedIn : false,
				username : '',
				email : '',
				avatar : '',
				seen : []
			}
		case actionTypes.UPDATE_USER:
			return {
				...state,
				...action.data
			}
		case actionTypes.SWITCH_LANG:
			return {
				...state,
				lang : (state.lang === 'fr')?'en':'fr'
			}
		case actionTypes.MARK_MOVIE_SEEN:
			return {
				...state,
				seen : [...state.seen, action.id]
			}
		default:
			return state;
	}
}

export default reducer;
