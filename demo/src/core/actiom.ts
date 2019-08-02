import { Observable } from 'rxjs';

export type Action<TIn, TOut> = (action: Observable<TIn>) => Observable<TOut>;