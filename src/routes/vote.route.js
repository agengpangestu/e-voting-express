const VoteController = require('../controllers/vote.controller');
const VoteHandler = require('../middlewares/vote.handler');

const router = require('express').Router();

const prisma = require("../database/prisma");


const BulkVote = () => {
    return {
        userID: 5,
        candidateID: 29,
        electionID: 1
    }
};

const createdBulk = async (howMany) => {
    const data = Array.from({ length: howMany }, () => BulkVote());
    const created = await prisma.vote.createMany({
        data: data.map(voted => ({
            userID: voted.userID,
            candidateID: voted.candidateID,
            electionID: voted.electionID
        }))
    });
    return created;
};

router.get('/', VoteController.Get);
router.get('/:id/schedule', VoteController.GetByID);
router.post('/post',
    VoteHandler.CheckCandidateWhenVoted,
    VoteHandler.CheckElectionWhenVoted,
    VoteHandler.checkUserWhenVoted,
    VoteHandler.CheckUniqueVoted,
    VoteController.Post);
router.patch('/:id/schedule-update', VoteController.Update);
router.delete('/:id/schedule-delete', VoteController.Deleted);

router.post('/vote-bulk', async (req, res, next) => {
    try {
        const { howMany } = req.body;
        const createBulk = await createdBulk(howMany);
        res.json({ message: "OK", data: createBulk });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;