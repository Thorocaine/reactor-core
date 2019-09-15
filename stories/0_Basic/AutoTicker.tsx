import React from 'react';
import createReactor from '../../src/core/createReactor';
import { map, tap, switchMap } from 'rxjs/operators';
import createCore from '../../src/core/createCore';
import { Action } from '../../src/core/types';
import { action } from '@storybook/addon-actions';
import { interval } from 'rxjs';

function AutoTicker() {
  function isStart(action: Action): action is Action<'Start'> {
    return action.type === 'Start';
  }
  const autoTick = createReactor(0, isStart)(a$ =>
    a$.pipe(
      tap(v => action(`Start`)()),
      map(a => a._current),
      switchMap(v => interval(1000).pipe(map(_ => v++)))
      //tap(v => action(`Tick: ${v}`)())
    )
  );

  const connect = createCore({ autoTick });

  type Props = {
    autoTick: number;
  };
  function StaticTick({ autoTick }: Props) {
    connect.useDispatch({ type: 'Start' }, []);
    return <div>value: {autoTick}</div>;
  }

  const Tick = connect(StaticTick);

  return <Tick />;
}

export default AutoTicker;
