import React from 'react';
import './App.css';
import connect from './my-reactor';
import Ticker from './Ticker';
import MyNumber from './my-number';

function App({doubleTick}: { doubleTick: number }) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>{doubleTick}</h1>
        <Ticker  value={99} />
        <MyNumber fact="123" />
      </header>
    </div>
  );
}

export default  connect(App);
