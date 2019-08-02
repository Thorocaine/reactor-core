import React from 'react';
import connect from './my-reactor';

function MyNumber({fact}: {fact:string}) {
	return <pre>{fact}</pre>;
}

export default connect(MyNumber);