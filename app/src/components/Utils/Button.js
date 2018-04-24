
import React from 'react'

const Button = ( props ) => (
	<button className="btn btn-primary mt-2" disabled={props.loading} >
		{(props.loading)?<span><i className="fas fa-circle-notch fa-spin"></i> En cours...</span>:props.text}
	</button>
);

export default Button;
