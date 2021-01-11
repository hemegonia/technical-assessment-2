var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('client/')
});

router.get('/initialize', function(req, res, next) {
  res.send('initialize sent');
});

module.exports = router;
