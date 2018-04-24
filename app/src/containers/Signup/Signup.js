import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

import { signupProcess, reset } from '../../store/actions/signup'

import SignupForm from '../../components/SignupForm/SignupForm'

class Signup extends Component {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			firstname: '',
			email: '',
			username: '',
			password: '',
			confirmation: '',
			file: '',
			error: '',
			loading: false
		}
	}

	componentWillReceiveProps(next) {
		this.setState(next.data)
	}

	onChangeHandler = ( event ) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	render () {
		return (
			<div className="container">
				{this.props.isLoggedIn && <Redirect to="/" />}
				<div className="row justify-content-center">
					<div className="col-lg-8 col-md-10 col-sm-12 my-5">
						<SignupForm
							data={this.state}
							submit={this.props.signup}
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
		data : state.signup,
		isLoggedIn : state.user.isLoggedIn,
		lang : state.user.lang
	}
}

const mapDispatchToProps = dispatch => {
	return {
		signup: (data) => dispatch(signupProcess(data)),
		reset: () => dispatch(reset())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
