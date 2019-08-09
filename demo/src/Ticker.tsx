import React, { useCallback, ReactElement } from 'react';
import connect from './my-reactor';
import { Dispatch } from './core/types';

interface Props { dispatch: Dispatch; numNum: number; value: number }

function Ticker({ dispatch, numNum, value }: Props): ReactElement
{
    const handleClick = useCallback(() => dispatch({type: 'INC', value: numNum + 1}), [dispatch, numNum]);
    return (
        <div>
            <h1>
                {numNum}
                <button type="button" onClick={handleClick}>
          Tick
                </button>
            </h1>
            <small>My Value is {value}</small>
        </div>
    );
}

const comp = connect(Ticker);

export default comp;
