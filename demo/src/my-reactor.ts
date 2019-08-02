import Start from './core/start';
import { map, switchMap } from 'rxjs/operators';
import createCore from './core/create-core';
import unit from './core/unit';

const tick = Start(0);
const doubleTick = Start(0).reduce(a => a.pipe(map(x => x * 2)));

// const fact = Start(99).reduce(a =>
//   a.pipe(
// 	map(n => `${n}`)
// 	//switchMap(_ => fetch('http://numbersapi.com/42')),
//     //switchMap(r => r.text())
//   )
// );

const connect = createCore({ doubleTick, tick });

export default connect;
