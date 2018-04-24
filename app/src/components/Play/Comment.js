import React from 'react'
import Button from '../Utils/Button'
import * as lang from './Comment.lang'

const Comment = ( props ) => (
	<form onSubmit={(e) => { e.preventDefault(); props.submitComment(props.comment, props.videoId); } } >
		<div className="form-group">
			<label htmlFor="comment">{lang.title(props.lang)}</label>
			<input
				type="text"
				name="comment"
				id="comment"
				value={props.comment}
				className="form-control"
				onChange={props.onChange} />
		</div>
		{props.fail &&
		<p className="alert alert-danger">
			{lang.fail(props.lang)}
		</p>}
		{props.success &&
		<p className="alert alert-success">
			{lang.ok(props.lang)}
		</p>}
		<div className="form-group text-center">
			<Button text={lang.submit(props.lang)} loading={props.loading} />
		</div>
	</form>
)

export default Comment;
