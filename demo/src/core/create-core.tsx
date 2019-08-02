import React, { useState, useEffect, FC } from 'react';
import Reducer from './reducer';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

type Sim<T> = {[P in keyof T]: any }

type Config<TIn, TOut extends Sim<TIn>> = {
   [P in keyof TIn]: Reducer<TIn[P], TOut[P]> 
};

function reduceInitial<TIn, TOut extends Sim<TIn>>(config: Config<TIn, TOut>) {
  return (c: Partial<TOut>, key: string) => ({
    ...c,
    [key]: (config as any)[key].value
  }) as TOut;
}

function createDispatch<TIn, TOut extends Sim<TIn>>(config: Config<TIn, TOut>) {
  return (action: Partial<TIn>) => {
    for (const key in action) {
      if(!config[key]) return;
      const value = action[key];
      config[key].next(value as any);
    }
  };}

function mapKey<TIn, TOut extends Sim<TIn>>(config: Config<TIn, TOut>) {
  return (key: string) => (config as any)[key].pipe(map(value => ({ [key]: value })));
}

function mapResults<TOut>(state: TOut) {
  return (values: Partial<TOut>[]) => (values.reduce((c, v) => ({ ...c, ...v }), state) as TOut);
}

function createCore<TIn, TOut extends Sim<TIn>>(config: Config<TIn, TOut>) {
  type MyConfig = typeof config;
  type Out<T> = T extends Config<infer _, infer TO> ? TO : never;
  type ConnectedProps<T> = Omit<T, 'dispatch' | keyof Out<MyConfig>>;

  const intialMutable = Object.keys(config).reduce(reduceInitial(config), {}) as TOut;
  const connecttor = connect;
  connect.initial = Object.freeze(intialMutable);
  connect.dispatch = createDispatch(config);

  return connecttor;
  
  function connect<TProps, TConnectedProps = ConnectedProps<TProps>>(Component: FC<TProps>) {
    return ReactiveComponent;

    function ReactiveComponent (props: TConnectedProps) {
      const [state, setState] = useState(connect.initial);
      useEffect(() => {
        const all = Object.keys(config).map(mapKey(config)) as Observable<any>[];

        const subs = combineLatest(all)
          .pipe(map(mapResults(state)))
          .subscribe(newState => setState(newState));

        return () => subs.unsubscribe();
      }, [state]);
      const allProps = { ...props, ...state, dispatch: connect.dispatch };
      return Component(allProps as any);
    };
  }
}

export default createCore;