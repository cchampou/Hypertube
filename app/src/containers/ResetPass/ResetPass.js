import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actionTypes from '../../store/actions/actionTypes'

import ResetPassForm from '../../components/ResetPassForm/ResetPassForm';

class Reset extends Component {

	constructor(props) {
		super (props);
		this.state = {
			email: '',
			loading: false,
			ok : false
		}
	}

	componentWillReceiveProps(next) {
		this.setState(next.data)
	}

	onChange = ( event ) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	render () {
		return (
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-lg-4 col-md-6 col-sm-10 col-xs-12 my-5">
						<ResetPassForm
							data={this.state}
							onChange={this.onChange}
							onSubmit={this.props.resetPass}
							lang={this.props.lang} />
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		data: state.resetPass,
		lang : state.user.lang
	}
}

const mapDispatchToProps = dispatch => {
	return {
		resetPass: (data) => dispatch({ type : actionTypes.RESET_PASS_PROCESS, email : data.email })
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(Reset);
