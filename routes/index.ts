import express = require('express');
const router = express.Router();
import * as ApiTypes from '../types';

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('client/');
});

router.get('/initialize', (req, res, next) => {
  res.send('initialize sent');
});

export default router;
