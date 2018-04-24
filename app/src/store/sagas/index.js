
import { takeEvery } from 'redux-saga/effects'

import * as actionTypes from '../actions/actionTypes'

import { loginSaga, loginLocal, logout, autoLoginSaga, externalLoginSaga, resetPassSaga, newPassSaga } from './login'
import { signUpSaga } from './signup'
import { processCommentSaga } from './play'
import { processAccountSaga, switchLangSaga } from './account'
import { getGenresSaga } from './genre'
import { getMoviesSaga, getMovieSaga, getCastingSaga, getCommentsSaga } from './movie';
import { getProfileSaga } from './profile';

export function* sagaWatcher() {
	yield takeEvery(actionTypes.LOGIN_PROCESS, loginSaga);
	yield takeEvery(actionTypes.LOGIN_LOCAL, loginLocal);
	yield takeEvery(actionTypes.LOGOUT, logout);
	yield takeEvery(actionTypes.SIGNUP_PROCESS, signUpSaga);
	yield takeEvery(actionTypes.PROCESS_COMMENT, processCommentSaga);
	yield takeEvery(actionTypes.PROCESS_ACCOUNT, processAccountSaga);
	yield takeEvery(actionTypes.AUTO_LOGIN, autoLoginSaga);
	yield takeEvery(actionTypes.EXTERNAL_LOGIN, externalLoginSaga);
	yield takeEvery(actionTypes.RESET_PASS_PROCESS, resetPassSaga);
	yield takeEvery(actionTypes.GET_GENRES_SAGA, getGenresSaga);
	yield takeEvery(actionTypes.GET_MOVIES_SAGA, getMoviesSaga);
	yield takeEvery(actionTypes.GET_MOVIE_SAGA, getMovieSaga);
	yield takeEvery(actionTypes.GET_CASTING_SAGA, getCastingSaga);
	yield takeEvery(actionTypes.SWITCH_LANG_SAGA, switchLangSaga);
	yield takeEvery(actionTypes.GET_COMMENTS_SAGA, getCommentsSaga);
	yield takeEvery(actionTypes.GET_PROFILE_SAGA, getProfileSaga);
	yield takeEvery(actionTypes.NEW_PASS_PROCESS, newPassSaga);
}
