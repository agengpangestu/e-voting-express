const express = require('express');
const router = express.Router();

const UserRouter = require('./user.route');

router.use('/users', UserRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
