
import * as actionTypes from '../actions/actionTypes';

const initialState = {
    movies : [],
    page : 1,
    loadingList : false,
    movie_fr : {},
    movie_en : {},
    comments : [],
    cast_fr : {
        crew : [],
        cast : []
    },
    cast_en : {
        crew : [],
        cast : []
    }
}

const reducer = ( state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOADING_MOVIES:
            return {
                ...state,
                loadingList : true
            }
        case actionTypes.RESET_MOVIES:
            return {
                ...state,
                movies : [],
                page : 1
            }
        case actionTypes.GET_MOVIES:
            return {
                ...state,
                movies : [
                    ...state.movies,
                    ...action.movies
                ],
                page : state.page + 1,
                loadingList : false
            }
        case actionTypes.RESET_MOVIE:
            return {
                ...state,
                movie_en : initialState.movie_en,
                movie_fr : initialState.movie_fr
            }
        case actionTypes.GET_MOVIE:
            return {
                ...state,
                movie_fr : action.fr,
                movie_en : action.en
            }
        case actionTypes.GET_COMMENTS:
            return {
                ...state,
                comments : action.comments.reverse()
            }
        case actionTypes.GET_CASTING:
            return {
                ...state,
                cast_fr : action.fr,
                cast_en : action.en
            }
        default:
            return {
                ...state
            }
    }
}

export default reducer;