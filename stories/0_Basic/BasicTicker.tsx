import React, { useCallback } from 'react';
import createReactor from '../../src/core/createReactor';
import { map, tap } from 'rxjs/operators';
import createCore from '../../src/core/createCore';
import { Action, Dispatch } from '../../src/core/types';
import { action } from '@storybook/addon-actions';

function BasicTicker() {
  function isTick(action: Action): action is Action<'Tick', { value: number }> {
    return action.type === 'Tick';
  }
  const tick = createReactor(0, isTick)(a$ =>
    a$.pipe(
      tap(v => action(`Tick: ${v.value}`)(v)),
      map(a => a.value),
      tap(v => console.log(v))
    )
  );

  const { withReactor } = createCore({ tick });

  type Props = {
    dispatch: Dispatch;
    tick: number;
  };
  function StaticTick({ tick, dispatch }: Props) {
    const handleClick = useCallback(
      () => dispatch({ type: 'Tick', value: tick + 1 }),
      [dispatch, tick]
    );
    return (
      <div>
        value: {tick} &nbsp;
        <button type="button" onClick={handleClick}>
          +
        </button>
      </div>
    );
  }

  const Tick = withReactor(StaticTick);

  return <Tick />;
}

export default BasicTicker;
