import { put } from 'redux-saga/effects'

import { authRequest } from '../../services/network'

import * as actionTypes from '../actions/actionTypes'

export function* processCommentSaga({ comment, videoId }) {
	yield put({
		type : actionTypes.POST_COMMENT,
		comment
	});
	try {
		yield authRequest('/video/comment/'+videoId, 'post',{
			text : comment
		});
		yield put({
			type : actionTypes.POST_COMMENT_SUCCESS
		});
		yield put({
			type : actionTypes.GET_COMMENTS_SAGA,
			id : videoId
		})
 	} catch (err) {
		console.log(err);
		yield put({
			type : actionTypes.POST_COMMENT_FAILED
		})
	}
}
