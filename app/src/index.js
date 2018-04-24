import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import login from './store/reducers/login';
import signup from './store/reducers/signup';
import resetPass from './store/reducers/resetPass';
import user from './store/reducers/user';
import play from './store/reducers/play';
import account from './store/reducers/account';
import genre from './store/reducers/genre';
import movie from './store/reducers/movie';
import profile from './store/reducers/profile';
import newpass from './store/reducers/newpass';

import { sagaWatcher } from './store/sagas';

const rootReducer = combineReducers({
	login,
	signup,
	resetPass,
	user,
	play,
	account,
	genre,
	movie,
	profile,
	newpass
});

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(thunk, sagaMiddleware))
);

sagaMiddleware.run(sagaWatcher);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
