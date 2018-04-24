import React, { Component } from 'react';
import { connect } from 'react-redux';
import profile from '../../assets/img/profile.svg';
import Loading from '../../utils/Loader';
import { Redirect } from 'react-router-dom';
import * as actionTypes from '../../store/actions/actionTypes';

import * as lang from './Profile.lang'

class Profile extends Component {

    componentDidMount() {
        if (this.props.logged) {
            this.props.getProfile(this.props.match.params.id);
        }
    }

    render () {
        return (
            <div className="container-fluid">
                {!this.props.logged && <Redirect to="/" />}
                <div className="row justify-content-center mt-5">
                    <div className="col-lg-4 col-md-6 col-sm-10 bg-dark text-center p-4">
                        {(this.props.loading)?
                        <div>
                            <Loading />
                            {lang.loading(this.props.lang)}
                        </div>
                        :<div>
                            <img className="img-thumbnail w-50 my-4" src={(this.props.profile.avatar)?this.props.profile.avatar:profile} alt="profile" />
                            <h2 className="text-muted">{this.props.profile.username}</h2>
                            <h1>{this.props.profile.firstname} {this.props.profile.name}</h1>
                            <p className="lead">
                                <strong>{lang.nbviews(this.props.lang)} : {this.props.profile.seen.length}</strong><br />
                            </p>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    profile : state.profile,
    lang : state.user.lang,
    logged : state.user.isLoggedIn
});

const mapDispatchToProps = dispatch => ({
    getProfile : id => dispatch({ type : actionTypes.GET_PROFILE_SAGA, id })
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);