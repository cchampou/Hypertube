
import { put } from 'redux-saga/effects';

import { authRequest } from '../../services/network';

import * as actionTypes from '../actions/actionTypes';

export function* getProfileSaga( action ) {
    try {
        const res = yield authRequest('/user/select/'+action.id, 'get');
        yield put({
            type : actionTypes.GET_PROFILE,
            data : res.data
        });
    } catch (err) {
        console.log(err);
    }
}