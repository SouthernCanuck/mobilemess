import { LogLevel } from './log';

// these types must be synchronized between inspection and sketch app

export enum FromSketchMessageType {
  Ping = 'Ping',
  Log = 'Log',
  SaveSketchData = 'SaveSketchData',
}

export interface Ping {
  type: FromSketchMessageType.Ping;
}

export interface Log {
  type: FromSketchMessageType.Log;
  level: LogLevel;
  message: string;
}

export interface SaveSketchData {
  type: FromSketchMessageType.SaveSketchData;
  sketchId: string;
  modelJson: object;
}

export type FromSketchMessage
  = Ping
  | Log
  | SaveSketchData

export enum ToSketchMessageType {
  Pong = 'Pong',
  SetSketchData = 'SetSketchData',
}

export interface Pong {
  type: ToSketchMessageType.Pong;
}

export interface SetSketchData {
  type: ToSketchMessageType.SetSketchData;
  modelJson: object;
}

export type ToSketchMessage
  = Pong
  | SetSketchData
