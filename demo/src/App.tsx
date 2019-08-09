import React, { ReactElement } from 'react';
import './App.css';
import Ticker from './Ticker';

function App(): ReactElement
{
    return (
        <div className="App">
            <header className="App-header">
                <Ticker value={99} />
            </header>
        </div>
    );
}

export default  App;
