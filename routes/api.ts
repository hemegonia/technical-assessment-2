import express = require('express');
import { Game } from '../models/Game';
const router = express.Router();
import * as ApiTypes from '../models/types';

router.get('/initialize', (req, res, next) => {
  req.app.locals.game = new Game();
  res.json({
    msg: 'INITIALIZE',
    body: {
      newLine: null,
      heading: 'Player 1',
      message: 'Awaiting Player 1\'s Move',
    } as ApiTypes.StatusUpdate,
  } as ApiTypes.Payload);
});

router.post('/node-clicked', (req, res, next) => {
  const game = req.app.locals.game as Game;
  const gameMsg = game.onClick(req.body);

  res.json({
    msg: gameMsg,
    body: {
      newLine:
        gameMsg !== 'VALID_END_NODE' && gameMsg !== 'GAME_OVER'
          ? null
          : game.moves[game.moves.length - 1],
      heading: 'Player ' + game.currentPlayer,
      message: game.getGameMessage(gameMsg),
    } as ApiTypes.StatusUpdate,
  } as ApiTypes.Payload);
});

export default router;
