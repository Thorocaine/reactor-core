import { Action } from './core/types';
import {map} from 'rxjs/operators';
import createCore from './core/createCore';
import createReactor from './core/createReactor';

interface MyA {type: 'INC' }

const isNumNum = (a: Action): a is MyA => a.type === 'INC';

const numNum = createReactor(0, isNumNum, a$ => a$.pipe(map(a => a._current + 1)));

const connect = createCore({numNum});

// alert(JSON.stringify(connect.getValue()));

export default connect;