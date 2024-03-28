const express = require('express');
const router = express.Router();

const UserRouter = require('./user.route');
const CandidateRouter = require('./candidate.route');

router.use('/users', UserRouter);
router.use('/candidates', CandidateRouter);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
