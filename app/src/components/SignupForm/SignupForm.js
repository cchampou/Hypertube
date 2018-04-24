import React from 'react'
import Button from '../Utils/Button';
import { Link } from 'react-router-dom'
import * as lang from './SignupForm.lang'

const SignupForm = ( props ) => (
	<form className="card p-4" onSubmit={(e) => { e.preventDefault(); props.submit(props.data) } } >
		<h2 className="text-center mb-2">{lang.title(props.lang)}</h2>
		{(props.data.error)?<p className="alert alert-danger">{props.data.error}</p>:null}
		<div className="row">
			<div className="col-lg-6 col-md-6">
				<div className="form-group">
					<label htmlFor="name">{lang.name(props.lang)}</label>
					<input
						type="text"
						id="name"
						name="name"
						value={props.data.name}
						onChange={props.onChangeHandler}
						className="form-control"
						disabled={props.data.loading} />
				</div>
				<div className="form-group">
					<label htmlFor="firstname">{lang.firstname(props.lang)}</label>
					<input
						type="text"
						id="firstname"
						name="firstname"
						value={props.data.firstname}
						onChange={props.onChangeHandler}
						className="form-control"
						disabled={props.data.loading} />
				</div>
				<div className="form-group">
					<label htmlFor="email">{lang.email(props.lang)}</label>
					<input
						type="email"
						id="email"
						name="email"
						value={props.data.email}
						onChange={props.onChangeHandler}
						className="form-control"
						disabled={props.data.loading} />
				</div>
				<div className="form-group">
					<label htmlFor="profilePic">{lang.avatar(props.lang)}</label>
					<input
						type="file"
						className="form-control"
						id="signupImg"
						name="profilePic"
						onChange={props.onChangeHandler}
						disabled={props.data.loading}
						/>
				</div>
			</div>
			<div className="col-lg-6 col-md-6">
				<div className="form-group">
					<label htmlFor="username">{lang.username(props.lang)}</label>
					<input
						type="text"
						id="username"
						name="username"
						value={props.data.username}
						onChange={props.onChangeHandler}
						className="form-control"
						disabled={props.data.loading} />
				</div>
				<div className="form-group">
					<label htmlFor="password">{lang.password(props.lang)}</label>
					<input
						type="password"
						value={props.data.password}
						id="password"
						name="password"
						onChange={props.onChangeHandler}
						className="form-control"
						disabled={props.data.loading} />
				</div>
				<div className="form-group">
					<label htmlFor="confirmation">{lang.confirmation(props.lang)}</label>
					<input
						type="password"
						value={props.data.confirmation}
						id="confirmation"
						name="confirmation"
						onChange={props.onChangeHandler}
						className="form-control"
						disabled={props.data.loading} />
				</div>
			</div>
		</div>
		<div className="row">
			<div className="col text-center">
				<Link to="/login" className="btn btn-sm btn-link">{lang.already(props.lang)}</Link><br />
				<Button loading={props.data.loading} text={lang.submit(props.lang)} />
			</div>
		</div>
	</form>
)

export default SignupForm;
