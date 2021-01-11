export {};
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get(
  '/',
  (req: any, res: { redirect: (arg0: string) => void }, next: any) => {
    res.redirect('client/');
  }
);

router.get(
  '/initialize',
  (req: any, res: { send: (arg0: string) => void }, next: any) => {
    res.send('initialize sent');
  }
);

module.exports = router;
