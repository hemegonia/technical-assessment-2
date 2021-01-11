type integer = number;
type float = number;

export interface Point {
  x: integer;
  y: integer;
}

export interface Line {
  start: Point;
  end: Point;
}

export interface StatusUpdate {
  newLine: Line | null;
  heading: string | null;
  message: string | null;
}

export interface Payload {
  msg: PayloadTypes;
  body: StatusUpdate | Point | string;
}

export type PayloadTypes =
  'INITIALIZE' |
  'VALID_START_NODE' |
  'INVALID_START_NODE' |
  'VALID_END_NODE' |
  'INVALID_END_NODE' |
  'GAME_OVER';

export class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
