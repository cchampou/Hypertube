import React from 'react';

import loading from '../assets/img/loading.svg';

const Loading = props => (
    <div style={{ width : '100%' }} className="text-center py-5">
        <img src={loading} className="mx-auto" alt="Loading" /><br />
        {props.text}
    </div>
)

export default Loading;