import {Point, Line} from './types';
export class Game {
  currentPlayer: null | 1 | 2;
  moves: Line[];

  constructor() {
    this.currentPlayer = 1;
    this.moves = [];
  }
}
