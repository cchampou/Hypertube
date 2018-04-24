import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actionTypes from '../../store/actions/actionTypes'

class Auth extends Component {

    state = { 
        redirect : false
    }

    componentDidMount() {
        this.props.authenticate(this.props.match.params.token);
    }

    componentWillReceiveProps(next) {
        this.setState({
            redirect : next.redirect
        });
    }

    render () {
        return (
            <div>
                {this.state.redirect && <Redirect to="/" />}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    redirect : state.login.externalRedirect
});

const mapDispatchToProps = dispatch => ({
    authenticate: token => dispatch({ type : actionTypes.EXTERNAL_LOGIN, token : token })
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);