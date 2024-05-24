const resultsVoteController = require('../controllers/results.vote.controller');

const router = require('express').Router();

router.get('/', resultsVoteController.GetResults);
router.get('/:id', resultsVoteController.GetResult);

module.exports = router;