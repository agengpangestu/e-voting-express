const prisma = require("../database/prisma");

const Candidate = prisma.candidate;
const ElectionSchedule = prisma.election_Schedulling;
const User = prisma.user;
const Vote = prisma.vote;

const checkUserWhenVoted = async (req, res, next) => {
    const userID = req.body.userID;

    await User.findUnique({
        where: { id: userID }
    }).then((result) => {
        (!result) ? res
            .status(404)
            .json({
                message: "Invalid user",
                status: 404
            }) : next()
    }).catch((err) => {
        next(err);
    });
}

const CheckCandidateWhenVoted = async (req, res, next) => {
    const candidateID = req.body.candidateID;

    await Candidate.findUnique({
        where: {
            candidateID: candidateID
        }
    }).then((result) => {
        (!result) ? res
            .status(404)
            .json({
                message: "Invalid candidate",
                status: 404
            }) : next()
    }).catch((err) => {
        next(err);
    });
};

const CheckElectionWhenVoted = async (req, res, next) => {
    const electionID = req.body.electionID;

    await ElectionSchedule.findUnique({
        where: {
            electionID: electionID
        }
    }).then((result) => {
        (!result) ? res
            .status(404)
            .json({
                message: "Invalid schedule",
                status: 404
            }) : next()
    }).catch((err) => {
        next(err);
    });
};

const CheckUniqueVoted = async (req, res, next) => {
    const { userID, candidateID } = req.body;

    const checkUnique = await Vote.findUnique({
        where: {
            userID_candidateID: {
                userID: userID,
                candidateID: candidateID
            }
        }
    }).then((result) => {
        (result)
            ? res.status(400).json({
                message: "You've chosen",
                status: 400
            })
            : next()
    }).catch((err) => {
        next(err)
    });
}

module.exports = { checkUserWhenVoted, CheckCandidateWhenVoted, CheckElectionWhenVoted, CheckUniqueVoted };