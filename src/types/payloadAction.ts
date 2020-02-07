import { Action } from 'redux';


export interface PayloadAction extends Action {
  payload: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
