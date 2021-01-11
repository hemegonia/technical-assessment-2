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
  msg: string;
  body: StatusUpdate | Point | string;
}

export class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
