import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

import { login, loginReset } from '../../store/actions/login';

import LoginForm from '../../components/LoginForm/LoginForm';

import './Login.css';

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: props.data
		}
	}

	componentDidMount() {
		this.props.reset();
	}

	componentWillReceiveProps(next) {
		this.setState({
			data: next.data
		})
	}

	onChangeHandler = ( event ) => {
		this.setState({
			data: { ...this.state.data, [event.target.name]: event.target.value }
		});
	}

	render () {
		return (
			<div className="container-fluid" id="loginBG">
				{this.props.isLoggedIn && <Redirect to="/" />}
				<div className="row justify-content-center">
					<div className="col-lg-4 bg-dark pt-4 col-md-6 my-5">
						<LoginForm
							submit={this.props.login}
							data={this.state.data}
							lang={this.props.lang}
							onChangeHandler={this.onChangeHandler} />
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		data: state.login,
		isLoggedIn : state.user.isLoggedIn,
		lang : state.user.lang
	}
}

const mapDispatchToProps = dispatch => {
	return {
		login: (data) => dispatch(login(data)),
		reset: () => dispatch(loginReset())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
