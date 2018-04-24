import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Utils/Button';

import * as config from '../../config'

import * as lang from './LoginForm.lang'

import './LoginForm.css';

const LoginForm = ( props ) => {
	return (
		<form className="text-center" onSubmit={(e) => { e.preventDefault(); props.submit(props.data); }} id="loginForm">
			<h2 className="text-center mb-2">{lang.login(props.lang)}</h2>
			{props.data.failed && <p className="alert alert-danger">{props.data.failed}</p>}
			{props.data.success && <p className="alert alert-success">OK</p>}
			<div className="form-group">
				<label htmlFor="username">{lang.username(props.lang)}</label>
				<input
					value={props.data.username}
					type="text"
					id="username"
					name="username"
					onChange={props.onChangeHandler}
					className="form-control"
					disabled={props.data.loading} />
			</div>
			<div className="form-group">
				<label htmlFor="password">{lang.password(props.lang)}</label>
				<input
					value={props.data.password}
					type="password"
					id="password"
					name="password"
					disabled={props.data.loading}
					onChange={props.onChangeHandler}
					className="form-control"/>
			</div>
			<Link to="/resetpass" className="btn btn-sm btn-link">{lang.forgot(props.lang)}</Link><br />
			<Link to="/signup" className="btn btn-sm btn-link">{lang.noaccount(props.lang)}</Link>
			<div className="form-group text-center">
				<Button loading={props.data.loading} text={lang.submit(props.lang)} />
			</div>
			<div className="form-group">
				<a className="btn btn-dark form-control" href={config.api_url+'/auth/42'}>{lang.fourtytwo(props.lang)}</a>
			</div>
			<div className="form-group">
				<a className="btn btn-dark form-control" href={config.api_url+'/auth/google'}>{lang.google(props.lang)}</a>
			</div>
		</form>
	)
}

export default LoginForm;
