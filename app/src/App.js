import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

import Search from './containers/Search/Search';
import Play from './containers/Play/Play';
import Login from './containers/Login/Login';
import Signup from './containers/Signup/Signup';
import Account from './containers/Account/Account';
import ResetPass from './containers/ResetPass/ResetPass';
import Auth from './containers/Auth/Auth';
import Profile from './containers/Profile/Profile';
import NewPass from './containers/NewPass/NewPass';

import axios from 'axios';

import bg from './assets/img/bg.jpg'

import './App.css';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			background : '',
			hide : true
		}	
	}

	randomize = (on = false) => {
		this.setState({
			hide : true
		});
		if (on) {
			axios.get('https://api.unsplash.com/photos/random?query=movie', {
				headers : {
					'Authorization' : 'Client-ID 4f8ab43cc45f8952da4850f074dfc89bc8e3bf6c4da619bea8d6c9b4a68544a3'
				}
			}).then((res) => {
				this.setState({
					background : res.data.urls.full
				});
				setTimeout(() => {
					this.setState({
						hide : false
					})
				}, 1000);
			}).catch((err) => {
				this.setState({
					background : bg
				});
				setTimeout(() => {
					this.setState({
						hide : false
					})
				}, 1000);
			})
		} else {
			this.setState({
				background : bg
			});
			setTimeout(() => {
				this.setState({
					hide : false
				})
			}, 1000);
		}
	}

	componentDidMount() {
		this.randomize(true);
		setInterval(() => this.randomize(true), 60000);
	}

	render () {
		return (
		<BrowserRouter>
			<div style={{ minHeight: '100%', position: 'relative', paddingBottom: '60px' }}>
				<Header />
				<div style={{ position: 'fixed', backgroundPosition : 'center', backgroundSize : 'cover', height : '100vh', width: '100%', backgroundImage : 'url('+this.state.background+')', marginTop : '-56px' }}></div>
				<div style={{ backgroundColor : 'rgba(0, 0, 0, 0.5)', position: 'fixed', height : '100vh', width: '100%', marginTop : '-56px' }}></div>
				<div style={{ backgroundColor : 'black', opacity: (this.state.hide?'1':'0'), position: 'fixed', height : '100%', width: '100%', transition: 'opacity 0.5s', marginTop : '-56px' }}></div>
				<Switch>
					<Route path="/" exact component={Search} />
					<Route path="/play/:id" exact component={Play} />
					<Route path="/authenticate/:token" exact component={Auth} />
					<Route path="/login" exact component={Login} />
					<Route path="/account" exact component={Account} />
					<Route path="/signup" exact component={Signup} />
					<Route path="/resetpass" exact component={ResetPass} />
					<Route path="/newpass/:token" exact component={NewPass} />
					<Route path="/user/:id" exact component={Profile} />
				</Switch>
				<Footer />
			</div>
		</BrowserRouter>
		)
	}
}

export default App;
