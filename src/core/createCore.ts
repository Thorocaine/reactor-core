import { UnkownReactors, CoreResults, Action, Reactor } from './types';
import { ReactElement, useMemo, useState, useEffect } from 'react';
import { Subscription } from 'rxjs';

type Element = JSX.Element | ReactElement | null;

type RC<P> = { displayName?: string } & ((props: P) => Element);

type Without<P, T> = Omit<P, 'dispatch' | keyof T>;

type Connect<T> = <P>(component: RC<P>) => RC<Without<P, T>>;

type Core<T extends {}> = {
  withReactor: Connect<T>;
  getValue: () => T;
  useDispatch: (action: Action, deps: Readonly<any[]>) => void;
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

  const keys: Array<keyof State> = Object.keys(reactors);
  return { withReactor, getValue, useDispatch };

  function useDispatch(action: Action, deps: Readonly<any[]>) {
    useEffect(() => dispatch(action), deps);
  }

  function withReactor<P>(
    component: RC<P>
    //...keys: Array<keyof State>
  ): RC<Without<P, T>> {
    const ConnectedComp: RC<Without<P, T>> = (props: Without<P, T>) => {
      const init = useMemo(getValue, []);
      const [state, setState] = useState(init);
      const stateProps = { ...state, dispatch, ...props };
      const deps = keys.map(k => state[k]);
      useEffect(effect(state, setState), [...keys, ...deps, setState]);

      const element = component(stateProps as P);
      return element;
    };
    ConnectedComp.displayName = `${component.name}_WithReactor`;
    return ConnectedComp;
  }

  function dispatch(action: Action): void {
    reactorArray.forEach(([, rxr]) => rxr.dispatch(action));
  }

  function effect(state: State, setState: SetState): () => () => void {
    return () => {
      // const subscriptions =
      reactorArray.map(subscribe(state, setState));
      return () => console.log('Should unsubscribe here.');
      // return () => subscriptions.forEach(sub => sub.unsubscribe());
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
    return ([key, rxr]) =>
      rxr.subscribe(result => setState({ ...state, [key]: result }));
  }
}

export default createCore;
