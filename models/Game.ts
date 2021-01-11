import { Point, Line, PayloadTypes } from './types';
export class Game {
  currentPlayer: 1 | 2;
  currentClicks: Point[];
  moves: Line[];
  endPoints: Point[];
  occupiedPoints: Point[];

  constructor() {
    this.currentPlayer = 1;
    this.moves = [];
    this.endPoints = [];
    this.occupiedPoints = [];
    this.currentClicks = [];
  }

  // Check if point has been occupied by checking line with same start and end point
  isValidPoint(point: Point) {
    if (point.x < 0 || point.x > 3 || point.y < 0 || point.y > 3) return false;
    if (!this.endPoints.length) {
      return true;
    }

    const idx = this.endPoints.findIndex((end) => {
      return end.x === point.x && end.y === point.y;
    });
    if (this.currentClicks.length) {
      if (idx < 0) {
        return true;
      }
    } else {
      if (idx > -1) {
        return true;
      }
    }
    return false;
  }

  isNotOccupied(point: Point) {
    const filtered = this.occupiedPoints.filter((p) => {
      if (p.x === this.endPoints[0].x && p.y === this.endPoints[0].y)
        return false;
      if (p.x === this.endPoints[1].x && p.y === this.endPoints[1].y)
        return false;
      return true;
    });
    const idx = filtered.findIndex((end) => {
      return end.x === point.x && end.y === point.y;
    });
    return idx === -1;
  }

  // Check to see if proposed line intersects any prior moves(lines)
  isValidLine(line: Line) {
    // Reject if line length is 0
    if (!this.getLineLength(line)) return false;

    // Check all points along the line and intersections
    return (
      this.getPoints(line).every((point) => {
        return this.isNotOccupied(point);
      }) &&
      this.moves.every((move) => {
        return !this.intersects(
          line.start.x,
          line.start.y,
          line.end.x,
          line.end.y,
          move.start.x,
          move.start.y,
          move.end.x,
          move.end.y
        );
      })
    );
  }

  getPoints(line: Line): Point[] {
    const result: Point[] = [];
    const diffX = line.end.x - line.start.x;
    const diffY = line.end.y - line.start.y;
    const minX = Math.min(line.end.x, line.start.x);
    const minY = Math.min(line.end.y, line.start.y);
    const slope = this.getSlopeAngle(line.start, line.end);
    if (Math.abs(diffX) === Math.abs(diffY)) {
      if (slope < 0) {
        if (minY === 0) {
          for (let i = 0; i <= Math.abs(diffX); i++) {
            result.push({
              x: line.start.x - i,
              y: line.start.y + i,
            });
          }
        } else {
          for (let i = 0; i <= Math.abs(diffX); i++) {
            result.push({
              x: line.start.x + i,
              y: line.start.y - i,
            });
          }
        }
      } else {
        for (let i = 0; i <= Math.abs(diffX); i++) {
          result.push({
            x: minX + i,
            y: minY + i,
          });
        }
      }
    } else if (diffX) {
      for (let i = 0; i <= Math.abs(diffX); i++) {
        result.push({
          x: minX + i,
          y: minY,
        });
      }
    } else if (diffY) {
      for (let i = 0; i <= Math.abs(diffY); i++) {
        result.push({
          x: minX,
          y: minY + i,
        });
      }
    }
    return result;
  }

  getLineLength(line: Line) {
    const diffX = Math.abs(line.end.x - line.start.x);
    const diffY = Math.abs(line.end.y - line.start.y);
    let blocks = diffY + diffX;

    // Check line length for same point
    if (line.start.x === line.end.x && line.start.y === line.end.y) return 0;

    // Check for diagonal line, must be 45 degrees if there is a slope
    if (diffY && diffX) {
      if (diffX !== diffY) return 0;
      blocks /= 2;
    }

    return blocks;
  }

  onClick(point: Point): PayloadTypes {
    // If point is valid and not previously clicked, add it to click tracker
    if (this.isValidPoint(point) && this.isNotOccupied(point)) {
      this.currentClicks.push(point);
    } else {
      if (!this.currentClicks.length) {
        this.resetClicks();
        return 'INVALID_START_NODE';
      } else {
        this.resetClicks();
        return 'INVALID_END_NODE';
      }
    }

    // If click tracker has two points, evaluate validity of the move by checking the line
    if (this.currentClicks.length === 2) {
      const proposedMove = {
        start: this.currentClicks[0],
        end: this.currentClicks[1],
      };
      this.resetClicks();
      if (this.isValidLine(proposedMove)) {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.recordMove(proposedMove);

        // End game if no more moves are possible
        if (!this.hasPossibleMoves(this.endPoints[0])) return 'GAME_OVER';
        if (!this.hasPossibleMoves(this.endPoints[1])) return 'GAME_OVER';
        return 'VALID_END_NODE';
      } else {
        return 'INVALID_END_NODE';
      }
    }

    return 'VALID_START_NODE';
  }

  recordMove(line: Line) {
    this.moves.push(line);
    this.occupiedPoints = this.occupiedPoints.concat(this.getPoints(line));
    this.updateEndpoints(line);
  }

  updateEndpoints(line: Line) {
    if (!this.endPoints.length) {
      this.endPoints = [line.start, line.end];
    } else {
      if (
        line.start.x === this.endPoints[0].x &&
        line.start.y === this.endPoints[0].y
      ) {
        this.endPoints = [line.end, this.endPoints[1]];
      } else if (
        line.start.x === this.endPoints[1].x &&
        line.start.y === this.endPoints[1].y
      ) {
        this.endPoints = [line.end, this.endPoints[0]];
      } else if (
        line.end.x === this.endPoints[0].x &&
        line.end.y === this.endPoints[0].y
      ) {
        this.endPoints = [line.start, this.endPoints[1]];
      } else {
        this.endPoints = [line.start, this.endPoints[0]];
      }
    }
  }

  resetClicks() {
    this.currentClicks = [];
  }

  getGameMessage(payloadType: PayloadTypes): string | null {
    switch (payloadType) {
      case 'GAME_OVER':
        return `Player ${this.currentPlayer} Wins!`;
      case 'VALID_START_NODE':
        return 'Select a second node to complete the line.';
      case 'INVALID_START_NODE':
        return 'Not a valid starting position.';
      case 'VALID_END_NODE':
        return null;
      case 'INVALID_END_NODE':
      default:
        return 'Invalid move!';
    }
  }

  getSlopeAngle(pointA: Point, pointB: Point) {
    return (
      (Math.atan((pointB.y - pointA.y) / (pointB.x - pointA.x)) * 180) / Math.PI
    );
  }

  // Detects intersecting lines
  // tslint:disable-next-line:max-line-length
  // Sourced from: https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
  intersects(
    a: number,
    b: number,
    c: number,
    d: number,
    p: number,
    q: number,
    r: number,
    s: number
  ) {
    const det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
    }
  }

  // Check all 8 adjacent positions for possible valid move
  hasPossibleMoves(point: Point) {
    if (
      point.x > 0 &&
      point.y > 0 &&
      this.isValidLine({
        start: point,
        end: { x: point.x - 1, y: point.y - 1 },
      })
    ) {
      return true;
    }
    if (
      point.x < 3 &&
      point.y < 3 &&
      this.isValidLine({
        start: point,
        end: { x: point.x + 1, y: point.y + 1 },
      })
    ) {
      return true;
    }
    if (
      point.x > 0 &&
      point.y < 3 &&
      this.isValidLine({
        start: point,
        end: { x: point.x - 1, y: point.y + 1 },
      })
    ) {
      return true;
    }
    if (
      point.x < 3 &&
      point.y > 0 &&
      this.isValidLine({
        start: point,
        end: { x: point.x + 1, y: point.y - 1 },
      })
    ) {
      return true;
    }
    if (
      point.y > 0 &&
      this.isValidLine({
        start: point,
        end: { x: point.x, y: point.y - 1 },
      })
    ) {
      return true;
    }
    if (
      point.y < 3 &&
      this.isValidLine({
        start: point,
        end: { x: point.x, y: point.y + 1 },
      })
    ) {
      return true;
    }
    if (
      point.x < 3 &&
      this.isValidLine({
        start: point,
        end: { x: point.x + 1, y: point.y },
      })
    ) {
      return true;
    }
    if (
      point.x > 0 &&
      this.isValidLine({
        start: point,
        end: { x: point.x - 1, y: point.y },
      })
    ) {
      return true;
    }
    return false;
  }
}
