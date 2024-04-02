const express = require('express');
const router = express.Router();

const UserRouter = require('./user.route');
const CandidateRouter = require('./candidate.route');
const ScheduleRouter = require('./schedule.route');

router.use('/users', UserRouter);
router.use('/candidates', CandidateRouter);
router.use('/schedules', ScheduleRouter);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
