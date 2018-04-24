import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { processAccount, resetAccount } from '../../store/actions/account';

import AccountForm from '../../components/AccountForm/AccountForm';

import './Account.css';

class Account extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user : props.user,
			newUsername : props.newUsername,
			newEmail : props.newEmail,
			newPassword : props.newPassword,
			newConfirmation : props.newConfirmation
		}
	}

	componentWillReceiveProps({ user, newUsername, newEmail, newPassword, newConfirmation }) {
		this.setState({
			user,
			newUsername,
			newEmail,
			newPassword,
			newConfirmation
		})
	}

	componentDidMount() {
		this.props.reset();
	}

	onChangeHandler = ( event ) => {
		this.setState({
			[event.target.name] : event.target.value
		});
	}

	render() {
		return (
			<div className="container-fluid" id="loginBG">
				{!this.props.logged && <Redirect to="/" />}
				<div className="row justify-content-center">
					<div className="col-lg-8 col-md-8 col-sm-10 my-5">
						<AccountForm
							data={this.state.user}
							handleChange={this.onChangeHandler}
							submitAccount={this.props.submitAccount}
							loading={this.props.loading}
							fail={this.props.fail}
							success={this.props.success}
							newUsername={this.state.newUsername}
							newEmail={this.state.newEmail}
							newPassword={this.state.newPassword}
							newConfirmation={this.state.newConfirmation}
							lang={this.props.lang} />
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		user : state.user,
		loading : state.account.loading,
		success : state.account.success,
		fail : state.account.fail,
		newUsername : state.account.newUsername,
		newEmail : state.account.newEmail,
		newPassword : state.account.newPassword,
		newConfirmation : state.account.newConfirmation,
		lang : state.user.lang,
		logged : state.user.isLoggedIn
	}
}

const mapDispatchToProps = dispatch => {
	return {
		submitAccount: data => dispatch(processAccount(data)),
		reset: () => dispatch(resetAccount())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
