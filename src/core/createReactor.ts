import { Action, Reactor } from './types';
import { Subject, Observable } from 'rxjs';

type WithValue<A extends Action, R> = A & { _current: R };
type TestAction<A extends Action> = (action: Action) => action is A;
type ReactiveReducer<R, A extends Action> = (
  actions$: Observable<WithValue<A, R>>
) => Observable<R>;

function createReactor<R, A extends Action>(
  initialValue: R,
  test: TestAction<A>
) {
  return function(reduce: ReactiveReducer<R, A>): Reactor<R, A> {
    const source = new Subject<WithValue<A, R>>();
    const reducer = reduce(source) as Reactor<R, A>;
    reducer.value = initialValue;
    reducer.subscribe(result => (reducer.value = result));
    reducer.dispatch = (action: Action) => {
      if (test(action)) {
        const valueAction = action as WithValue<A, R>;
        valueAction._current = reducer.value;
        source.next(valueAction);
      }
    };
    return reducer;
  };
}

export default createReactor;
