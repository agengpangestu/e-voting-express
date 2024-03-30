const CandidateController = require('../controllers/candidate.controller');

const router = require('express').Router();

router.get('/', CandidateController.Get);
router.get('/:id/candidate', CandidateController.GetByID);
router.post('/post', CandidateController.Post);
router.patch('/:id/candidate-update', CandidateController.Update);
router.delete('/:id/candidate-delete', CandidateController.Deleted);

module.exports = router;