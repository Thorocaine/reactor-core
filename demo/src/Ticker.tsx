import React, { useCallback } from 'react';
import connect from './my-reactor';

type Props = { dispatch: typeof connect.dispatch; tick: number, value:number };

function Ticker({ dispatch, tick, value }: Props) {
  const handleClick = useCallback(() => {
    tick++;
    dispatch({ tick, doubleTick: tick });
  }, [dispatch, tick]);

  return (
    <div>
      <h1>
        {tick}
        <button type="button" onClick={handleClick}>
          Tick
        </button>
      </h1>
	  <small>My Value is {value}</small>
    </div>
  );
}

const comp = connect<Props>(Ticker);

export default comp;
