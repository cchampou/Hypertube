import { put } from 'redux-saga/effects'

import * as actionTypes from '../actions/actionTypes'

import axios from 'axios';

export function* getGenresSaga ( action ) {
    try {
        const en = yield axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=a4343157cee95013cd656c957307d784&language=en-US');
        const fr = yield axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=a4343157cee95013cd656c957307d784&language=fr-FR');
        yield put({
            type : actionTypes.GET_GENRES,
            fr : fr.data.genres,
            en : en.data.genres
        })
    } catch (e) {
        console.log(e);
    }
}