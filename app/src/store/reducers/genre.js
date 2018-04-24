import * as actionTypes from '../actions/actionTypes'

const initialState = {
    genres_fr : [],
    genres_en : []
}

const reducer = ( state = initialState, action ) => {
    switch (action.type) {
        case actionTypes.GET_GENRES:
            return {
                ...state,
                genres_fr : action.fr,
                genres_en : action.en
            }
        default:
            return {
                ...state
            }
    }
}

export default reducer;

