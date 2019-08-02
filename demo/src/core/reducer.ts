import { Observable } from 'rxjs';
import { Action } from './actiom';

type Reducer<TIn, TOut> = Observable<TOut> & {
  next: (value: TIn) => void;
  value?: TOut;
};

function Reducer<TIn, TOut>(
  subject: Reducer<TIn, TIn>,
  initialValue: TIn,
  action: Action<TIn, TOut>
) {
  var observer = action(subject) as Reducer<TIn, TOut>;
  observer.next = (x) => subject.next(x);
  observer.subscribe(v => observer.value = v);
  observer.next(initialValue);
  return observer;
}

export default Reducer;
