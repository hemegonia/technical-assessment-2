import express = require('express');
const router = express.Router();
import * as ApiTypes from '../models/types';

router.get('/initialize', (req, res, next) => {
  res.json({
    msg: 'INITIALIZE',
    body: {
      newLine: null,
      heading: 'Player 1',
      message: 'Awaiting Player 1\'s Move',
    } as ApiTypes.StatusUpdate,
  } as ApiTypes.Payload );
});

// WIP, need to define Game class
router.post('/node-clicked', (req, res, next) => {
  // tslint:disable-next-line:no-console
  console.log(req.body);
  // res.json({
  //   msg: 'INITIALIZE',
  //   body: {
  //     newLine: null,
  //     heading: 'Player 1',
  //     message: 'Awaiting Player 1\'s Move',
  //   } as ApiTypes.StatusUpdate,
  // } as ApiTypes.Payload );
});

function onNodeClicked(){
  return;
}

export default router;
