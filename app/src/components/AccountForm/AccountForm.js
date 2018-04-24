import React from 'react';

import Button from '../Utils/Button'

import * as lang from './AccountForm.lang'

import ProfilePic from '../../assets/img/profile.svg';

const AccountForm = (props) => (
	<form onSubmit={(e) => {
			e.preventDefault();
			props.submitAccount(props);
		}}>
		<div className="row bg-dark mb-4 py-2">
			<div className="col">
				<h2 className="text-center bg-dark">{lang.account(props.lang)}</h2>
			</div>
		</div>
		<div className="row bg-dark py-4">
			<div className="col-lg-6">
				<div className="row justify-content-center">
					<div className="col-lg-6 col-md-4 col-sm-4 col-6 my-4">
						<img className="mx-auto img-thumbnail" style={{ width : '100%' }} src={(props.data.avatar)?props.data.avatar:ProfilePic} alt="Default profile" />
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="profilePic">{lang.avatar(props.lang)}</label>
					<input
						type="file"
						className="form-control"
						id="accountImg"
						name="profilePic" />
				</div>
			</div>
			<div className="col-lg-6">
				<div className="form-group">
					<label htmlFor="newUsername">{lang.username(props.lang)}</label>
					<input
						type="text"
						className="form-control"
						id="newUsername"
						name="newUsername"
						placeholder={props.data.username}
						onChange={props.handleChange}
						value={props.newUsername} />
				</div>
				<div className="form-group">
					<label htmlFor="newEmail">{lang.email(props.lang)}</label>
					<input
						type="email"
						className="form-control"
						id="newEmail"
						name="newEmail"
						placeholder={props.data.email}
						onChange={props.handleChange}
						value={props.newEmail} />
				</div>
				<div className="form-group">
					<label htmlFor="newPassword">{lang.password(props.lang)}</label>
					<input
						type="password"
						className="form-control"
						id="newPassword"
						name="newPassword"
						value={props.newPassword}
						onChange={props.handleChange} />
				</div>
				<div className="form-group">
					<label htmlFor="newConfirmation">{lang.confirmation(props.lang)}</label>
					<input
						type="password"
						className="form-control"
						id="newConfirmation"
						name="newConfirmation"
						onChange={props.handleChange}
						value={props.newConfirmation} />
				</div>
				{props.fail &&
					<p className="alert alert-danger">{props.fail}</p>}
				{props.success &&
					<p className="alert alert-success">{lang.success(props.lang)}</p>}
				<div className="form-group text-center">
					<Button text={lang.submit(props.lang)} loading={props.loading} />
				</div>
			</div>
		</div>
	</form>
)

export default AccountForm;
