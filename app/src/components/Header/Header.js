import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actionTypes from '../../store/actions/actionTypes'
import * as lang from './Header.lang'
import './Header.css';

class Header extends Component {

	componentDidMount() {
		this.props.autoLogin();
	}

	render() {
		return (
			<nav className="navbar navbar-expand-md navbar-dark bg-dark" style={{ zIndex : '10' }} >
				<Link className="navbar-brand-name" to="/">H Y P E R T U B E</Link>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ml-auto">

						<li className="nav-item active">
							<span className="nav-link" style={{ cursor: 'pointer' }} onClick={this.props.switchLang.bind(this, this.props.lang)} >{(this.props.lang === 'fr') ? 'EN' : 'FR'}</span>
						</li>
						{(this.props.isLoggedIn) ?
							<li className="nav-item active">
								<Link className="nav-link" to="/account">{lang.account(this.props.lang)}</Link>
							</li> : null}

						{(!this.props.isLoggedIn) ?
							<li className="nav-item active">
								<Link className="nav-link" to="/login">{lang.connexion(this.props.lang)}</Link>
							</li> : null}

						{(!this.props.isLoggedIn) ?
							<li className="nav-item active">
								<Link className="nav-link" to="/signup">{lang.signup(this.props.lang)}</Link>
							</li> : null}

						{(this.props.isLoggedIn) ?
							<li className="nav-item active">
								<Link to="/" className="nav-link" onClick={this.props.logout} >{lang.logout(this.props.lang)}</Link>
							</li> : null}
					</ul>
				</div>
			</nav>
		)
	}
}

const mapStateToProps = state => ({
	isLoggedIn: state.user.isLoggedIn,
	lang: state.user.lang
})

const mapDispatchToProps = dispatch => ({
	logout: () => dispatch({ type: actionTypes.LOGOUT }),
	autoLogin: () => dispatch({ type: actionTypes.AUTO_LOGIN }),
	switchLang: (current) => dispatch({ type: actionTypes.SWITCH_LANG_SAGA, lang: current })
})

export default connect(mapStateToProps, mapDispatchToProps)(Header);
