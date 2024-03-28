const prisma = require("../database/prisma");

const Candidate = prisma.candidate;
const User = prisma.user;

class CandidateController {
    async Get(req, res, next) {
        const { page = req.query.page ?? 1, limit = req.query.limit ?? 6 } = req.query;

        const pageOfNumber = parseInt(page),
            limitOfNumber = parseInt(limit);

        const offset = (pageOfNumber - 1) * limitOfNumber;

        await Candidate.findMany({
            // relationLoadStrategy: 'join', //what is this ??? fix okay ?
            include: {
                User: true
            },
            take: limitOfNumber,
            skip: offset,
        })
            .then(async (users) => {
                const countPages = await Candidate.count();

                const totalPages = Math.ceil(countPages / limitOfNumber);

                res.json({
                    message: "OK",
                    page: pageOfNumber,
                    countPages: countPages,
                    totalPages: totalPages,
                    data: users,
                })
            }).catch((err) => {
                console.log(err);
            });
    };

    async Post(req, res, next) { // cant post new candidate
        const body = {
            candidateName: req.body.candidateName,
            candidateVisi: req.body.candidateVisi,
            candidateMisi: req.body.candidateMisi,
            candidateAvatar: req.body.candidateAvatar,
            group: req.body.group,
            level: req.body.level,
            createdBy: req.body.createdBy,
        };

        await Candidate.create({
            data: body
        }).then((data) => {
            if (data) return res
                .status(200)
                .json({
                    message: "OK",
                    status: 200,
                    data: data
                })
        }).catch((err) => {
            console.log(err);
            return res.json({ error: err })
        });
    }
};

module.exports = new CandidateController();