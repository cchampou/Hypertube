import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faStar from '@fortawesome/fontawesome-free-solid/faStar'

import poster from '../../assets/img/poster.png';

import { processComment, resetComment } from '../../store/actions/play'

import * as lang from './Play.lang'

import * as actionTypes from '../../store/actions/actionTypes';

import Comment from '../../components/Play/Comment'

import Hls from 'hls.js';

import io from 'socket.io-client';

const socket = io('http://localhost:3000');


class Play extends Component {

	constructor (props) {
		super (props);
		this.state = {
			comment : props.comment,
			fail: props.fail,
			success: props.success,
			casting : 'Franck Gastambide, Malik Bentalha, Bernard Farcy',
			received: false,
			uniqId: null,
			subList: [],
			comments : [],
			details : {
				poster_path : '',
				release_date : '2018'
			},
			cast : {
				crew : [],
				cast : []
			},
			downloading : 0,
			converting: 0
		}
	}

	componentDidMount () {
		if (this.props.logged) {
			this.props.markMovieSeen(this.props.match.params.id);
			this.props.resetComment();
			this.props.getMovie(this.props.match.params.id);
			this.props.getCasting(this.props.match.params.id);
			socket.on('downloading', percentage => this.setState({downloading: Math.round(percentage)}));
			socket.on('converting', percentage => this.setState({converting: Math.round(percentage)}));
			socket.on('subList', list => {
				this.setState({subList: list})
			});
		}
	}

	componentWillUnmount (){
	    this.props.reset();
		if (this.state.received){
            this.state.received.destroy();
			socket.emit('destroyStream', null);
		}
        socket.removeListener('downloading');
        socket.removeListener('converting');
        socket.removeListener('subList');
	}

	componentWillReceiveProps ( { comment, fail, success, fr, en, lang, cast_en, cast_fr, comments, username } ) {
		let received = this.state.received;

		if (this.props.lang !== lang){
			if (this.state.received) {
                this.state.received.destroy();
                socket.emit('destroyStream', null);
            }
            this.setState({converting: 0, downloading: 0, received: false});
			// received = false;
		}

		if (this.props.username && this.props.lang && this.props[this.props.lang].title && this.props[this.props.lang].release_date && !received){
            let video = document.getElementById('example-video');
            let movieInfo = lang ? (lang === 'fr'  ? fr : en) : this.props[this.props.lang];

            socket.emit('getSubs', movieInfo.imdb_id);
            if(Hls.isSupported()) {
                var hls = new Hls({
					enableWebVTT: true,
                    manifestLoadingTimeOut: 600000,
                    manifestLoadingMaxRetry: 2,
                    autoStartLoad: false
                });


                hls.loadSource(`http://localhost:3000/video/m3u?name=${movieInfo.title}&year=${parseInt(movieInfo.release_date, 10)}&original=${movieInfo.original_title}&lang=${lang ? lang : this.props.lang}&imdbid=${movieInfo.imdb_id}`);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED,function() {
                    hls.startLoad(0);
                });
            }
            else if (video.canPlayType('application/vnd.apple.mpegurl')) {

                video.src = `http://localhost:3000/video/m3u?name=${movieInfo.original_title}`;
                video.addEventListener('canplay', function () {
                });
            }
            this.setState({ received : hls});
        }

        this.setState({
			comment,
			fail,
			success,
			details : (lang === 'en')?en:fr,
			cast : (lang === 'en')?cast_en:cast_fr,
			comments
		})
	}


	renderTracks(player){
		if (this.state.subList) {
            return this.state.subList.map((elem, index) => {
                if (elem && player.props[elem]) {
                    let lang = (elem === 'fr' ? 'French' : "English");
                    let movieInfo = player.props[elem];

                    return <track key={elem + index} label={lang} kind={'subtitles'} srcLang={elem}
								  src={`http://localhost:3000/video/sub/${movieInfo.imdb_id}_${lang}.vtt`}
								  crossOrigin={'anonymous'}/>
                } else {
                    return null;
                }
            });
        } else {
			return null;
		}
	}

	handleComment = (e) => {
		this.setState({
			comment : e.target.value
		});
	}

	render () {
		let visibility = !(this.state.converting >= 100);
		let value = (this.state.converting ? this.state.converting : this.state.downloading);

		return (
			<div className="container">
			{!this.props.logged && <Redirect to="/" />}
				<div className="row my-4">
					<div className="col">
						<div className="row py-4 bg-dark">
							<div className="col-3">
								<img className="img-fluid" src={(this.state.details.poster_path)?'https://image.tmdb.org/t/p/w200'+this.state.details.poster_path:poster} alt={this.state.details.title} />
							</div>
							<div className="col">
								<h1 className="mt-4">{this.state.details.title}</h1>
								<p className="card-subtitle text-muted">{this.state.details.release_date && this.state.details.release_date.substr(0,4)} - {this.state.details.vote_average} <span style={{ color : '#FFD600' }}><FontAwesomeIcon size="xs" icon={faStar}/></span> - {this.state.details.runtime} minutes</p>
								<p>
									<strong>{lang.by(this.props.lang)} : </strong>{this.state.cast.crew[0] && this.state.cast.crew[0].name}<br />
									<strong>{lang.and(this.props.lang)} : </strong>{this.state.cast.cast[0] && this.state.cast.cast[0].name}, {this.state.cast.cast[1] && this.state.cast.cast[1].name}, {this.state.cast.cast[2] && this.state.cast.cast[2].name} ...<br />
								</p>
								<p>
									{this.state.details.overview}
								</p>
							</div>
						</div>
						<div className="row py-4 my-4 bg-dark">
							<div className="col">
							<video id="example-video" style={{ width : '100%' }} crossOrigin={'anonymous'} hidden={visibility} controls>
								{this.renderTracks(this)}
							</video>
								<div hidden={!visibility}>
								<p className="text-center mt-5">
									{lang.prepare(this.props.lang) + (this.state.converting ? ' 2' : ' 1')}/2
								</p>
								<h2 className="text-center text-muted my-5">{value} %</h2>
								<div className="progress mb-5">
									<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100" style={{ width : value + '%' }}></div>
								</div>
								</div>
							</div>
						</div>
						<div className="row py-4 bg-dark">
							<div className="col-lg-6 col-md-6 col-sm-12">
								<h3>{lang.comments(this.props.lang)}</h3>
								{(!this.state.comments.length)?<p>{lang.nocom(this.props.lang)}</p>:null}
								{this.state.comments.map((com, key) => (
									<p key={key}>
										<span className="text-muted"><Link to={'/user/'+com.author} >{com.name}</Link> - {com.date.toString()}</span><br />
										{com.text}
									</p>
								))}
							</div>
							<div className="col-lg-6 col-md-6 col-sm-12">
								<Comment
									comment={this.state.comment}
									onChange={this.handleComment}
									submitComment={this.props.submitComment}
									loading={this.props.commentLoading}
									fail={this.state.fail}
									videoId={this.props.match.params.id}
									success={this.state.success}
									lang={this.props.lang} />
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		fr : state.movie.movie_fr,
		en : state.movie.movie_en,
		cast_fr : state.movie.cast_fr,
		cast_en : state.movie.cast_en,
		comments : state.movie.comments,
		lang : state.user.lang,
		commentLoading : state.play.commentLoading,
		comment : state.play.comment,
		success : state.play.success,
		fail : state.play.fail,
		username : state.user.username,
		logged : state.user.isLoggedIn
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getMovie : id => dispatch({ type : actionTypes.GET_MOVIE_SAGA, id : id }),
		getCasting : id => dispatch({ type : actionTypes.GET_CASTING_SAGA, id : id }),
		submitComment: (comment, videoId) => dispatch(processComment(comment, videoId)),
		resetComment: () => dispatch(resetComment()),
		reset : () => dispatch({ type : actionTypes.RESET_MOVIE }),
		markMovieSeen : id => dispatch({ type : actionTypes.MARK_MOVIE_SEEN, id })
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Play);
