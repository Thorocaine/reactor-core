import { Subject } from 'rxjs';
import Reducer from './reducer';
import { Action } from './actiom';

type Start<TIn, TOut> = Reducer<TIn, TIn> & {
	reduce: (action: Action<TIn, TOut>) => Reducer<TIn, TOut>
};

function Start<TIn, TOut> (initialValue: TIn): Start<TIn, TOut> {
	 const reducer = new Subject<TIn>() as unknown as Start<TIn, TOut>;
	 reducer.subscribe(v => reducer.value = v);
	 reducer.next(initialValue);
	 reducer.reduce = (action: Action<TIn, TOut>) => Reducer(reducer, initialValue, action);
	 return reducer;
}

export default Start;
