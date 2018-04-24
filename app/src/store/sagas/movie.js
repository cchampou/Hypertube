import  { put } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';

import { authRequest } from '../../services/network';

import axios from 'axios';

export function* getMoviesSaga( action ) {
    yield put({
        type : actionTypes.LOADING_MOVIES
    });
    try {
        if (!action.genre) {
            action.genre = 0;
        }
        const dgte = (action.dgte)?action.dgte:'1970';
        const dlte = (action.dlte)?action.dlte:'2019';
        const vgte = (action.vgte)?action.vgte:0;
        const vlte = (action.vlte)?action.vlte:10;
        const sort = (action.sort)?action.sort:'popularity.desc';
        const movies = yield authRequest('/video/'+action.lang+'/'+action.genre+'/'+action.page+'/'+dgte+'/'+dlte+'/'+vgte+'/'+vlte+'/'+sort+'/'+action.name, 'get');
        if (movies)
        {
            yield put({
                type : actionTypes.GET_MOVIES,
                movies : movies.data
            });
        }
    } catch (err) {
        console.log(err);
    }
}

export function* getMovieSaga ( action ) {
    try {
        const en = yield axios.get('https://api.themoviedb.org/3/movie/'+action.id+'?api_key=a4343157cee95013cd656c957307d784&language=en-US');
        const fr = yield axios.get('https://api.themoviedb.org/3/movie/'+action.id+'?api_key=a4343157cee95013cd656c957307d784&language=fr-FR');
        yield authRequest('/video', 'post', { idmovieDb : action.id });
        yield put({
            type : actionTypes.GET_MOVIE,
            fr : fr.data,
            en : en.data
        })
        yield put({
            type : actionTypes.GET_COMMENTS_SAGA,
            id : action.id
        });
    } catch (e) {
        console.log (e);
    }
}

export function* getCommentsSaga ( action ) {
    try {
        const comments = yield authRequest('/video/comment/'+action.id, 'get');
        yield put({
            type : actionTypes.GET_COMMENTS,
            comments : comments.data
        });
    } catch (e) {
        console.log(e);
    }
}

export function* getCastingSaga ( action ) {
    try {
        const en = yield axios.get('https://api.themoviedb.org/3/movie/'+action.id+'/credits?api_key=a4343157cee95013cd656c957307d784&language=en-US');
        const fr = yield axios.get('https://api.themoviedb.org/3/movie/'+action.id+'/credits?api_key=a4343157cee95013cd656c957307d784&language=fr-FR');
        yield put({
            type : actionTypes.GET_CASTING,
            fr : fr.data,
            en : en.data
        })
    } catch (e) {
        console.log (e);
    }
}