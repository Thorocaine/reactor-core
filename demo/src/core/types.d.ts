import { Observable } from 'rxjs';

export type Action<T = string, TP = {}> = {type: T} & TP;

export type Dispatch = <T extends Action>(action: T) => void;

type Reactor<R, A extends Action = Action> = Observable<R> & {
    dispatch: (action: Action) => void;
    value: R;
};

type ReactorResult<T extends Reactor<Action, unknown>> = T extends Reactor<infer _, infer R> ? R : unknown;

type CoreResults<T extends UnkownReactors> = { [K in keyof T]: ReactorResult<T[K]>  };

interface UnkownReactors { [key: string]: Reactor<unknown, Action> }