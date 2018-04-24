import React from 'react'
import Button from '../Utils/Button';
import { Link } from 'react-router-dom'

import * as lang from './ResetPass.lang'

const SignupForm = ( props ) => (
	<form className="card p-4" onSubmit={(e) => { e.preventDefault(); props.onSubmit(props.data); } } >
		<h2 className="text-center mb-2">{lang.forgot(props.lang)}</h2>
		{props.data.error && <p className="alert alert-danger">{props.data.error}</p>}
		{props.data.ok && <p className="alert alert-success">Un email vient de vous être envoyé pour modifier votre mot de passe</p>}
		<div className="form-group">
			<label htmlFor="email">{lang.email(props.lang)}</label>
			<input
				type="email"
				id="email"
				name="email"
				value={props.data.email}
				onChange={props.onChange}
				className="form-control"
				disabled={props.data.loading} />
		</div>
		<Link to="/login" className="btn btn-sm btn-link">{lang.back(props.lang)}</Link>
		<Button loading={props.data.loading} text={lang.submit(props.lang)} />
	</form>
)

export default SignupForm;
