import { UnkownReactors, CoreResults, Action, Reactor } from './types';
import { ReactElement, useMemo, useState, useEffect } from 'react';
import { Subscription } from 'rxjs';

type Element = JSX.Element | ReactElement | null;

type RC<P> = { displayName?: string } & ((props: P) => Element);

type Without<P, T> = Omit<P, 'dispatch' | keyof T>;

type Connect<T> = <P>(component: RC<P>) => RC<Without<P, T>>;

type Core<T extends {}> = Connect<T> & {
  getValue: () => T;
  useDispatch: (action: Action, deps?: Readonly<any[]>) => void;
};

function createCore<T extends UnkownReactors>(
  reactors: T
): Core<CoreResults<T>> {
  type Map = [keyof T, Reactor<unknown, Action>];
  type State = CoreResults<T>;
  type SetState = (newState: CoreResults<T>) => void;

  const reactorArray = Object.keys(reactors).map(
    (key): Map => [key, reactors[key]]
  );
  const connector = withReactor as Core<CoreResults<T>>;

  connector.getValue = () => getValue();

  connector['useDispatch'] = (action, deps = [action]) =>
    // eslint-disable-next-line
    useEffect(() => dispatch(action), deps);

  return connector;

  function withReactor<P>(component: RC<P>): RC<Without<P, T>> {
    const ConnectedComp: RC<Without<P, T>> = (props: Without<P, T>) => {
      const init = useMemo(getValue, []);
      const [state, setState] = useState(init);
      const stateProps = { ...state, dispatch, ...props };
      useEffect(effect(state, setState), [state, setState]);
      const element = component(stateProps as P);
      return element;
    };
    ConnectedComp.displayName = `${component.name}_Connected`;
    return ConnectedComp;
  }

  function dispatch(action: Action): void {
    reactorArray.forEach(([, rxr]) => rxr.dispatch(action));
  }

  function effect(state: State, setState: SetState): () => () => void {
    return () => {
      const subscriptions = reactorArray.map(subscribe(state, setState));
      return () => subscriptions.forEach(sub => sub.unsubscribe());
    };
  }

  function getValue(): CoreResults<T> {
    const i = {};
    return reactorArray.reduce(
      (current, [key, rxr]) => ({ ...current, [key]: rxr.value }),
      i as CoreResults<T>
    );
  }

  function subscribe(
    state: State,
    setState: SetState
  ): (_: Map) => Subscription {
    return ([key, rxr]) => {
      debugger;
      return rxr.subscribe(result => {
        debugger;
        setState({ ...state, [key]: result });
      });
    };
  }
}

export default createCore;
