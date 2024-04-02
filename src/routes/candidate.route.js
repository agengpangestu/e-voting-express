const CandidateController = require('../controllers/candidate.controller');
const CandidateHandler = require('../middlewares/candidate.handler');

const router = require('express').Router();

router.get('/', CandidateController.Get);

router.get('/:id/candidate', CandidateController.GetByID);

router.post('/post',
    CandidateHandler.CheckWhoCreated,
    CandidateHandler.CandidateBodyRequired,
    CandidateController.Post);

router.patch('/:id/candidate-update',
    CandidateHandler.CheckWhoCreated,
    CandidateController.Update);

router.delete('/:id/candidate-delete', CandidateController.Deleted);

module.exports = router;