import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import * as lang from './NewPass.lang'

import * as actionTypes from '../../store/actions/actionTypes'

class NewPass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password : '',
            confirmation : '',
            token : props.match.params.token
        }
    }

    handleInput (e) {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    render () {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-lg-4 bg-dark col-md-8 col-sm-12 my-5 p-4 text-center">
                        <h1 className="text-center">{lang.title(this.props.lang)}</h1>
                        <form onSubmit={(e) => { e.preventDefault(); this.props.submit(this.state) }}>
                            <div className="form-group">
                                <label htmlFor="password">{lang.password(this.props.lang)}</label>
                                <input type="password" name="password" onChange={this.handleInput.bind(this)} className="form-control"/>
                            </div>
                            <div className="form-group">
                              <label htmlFor="password">{lang.confirmation(this.props.lang)}</label>
                                <input type="password" name="confirmation" onChange={this.handleInput.bind(this)} className="form-control"/>
                            </div>
                            {this.props.fail && <p className="alert alert-danger">{this.props.fail}</p>}
                            {this.props.success && <p className="alert alert-success">Success ! <Link to="/login">Revenir à la page de login</Link></p>}
                            <input type="submit" className="btn btn-primary" value={lang.submit(this.props.lang)} />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}



const mapStateToProps = state => ({
    lang : state.user.lang,
    fail : state.newpass.fail,
    success : state.newpass.success
})

const mapDispatchToProps = disptach => ({
    submit : (data) => disptach({ type : actionTypes.NEW_PASS_PROCESS, data : data })
})

export default connect(mapStateToProps, mapDispatchToProps)(NewPass);