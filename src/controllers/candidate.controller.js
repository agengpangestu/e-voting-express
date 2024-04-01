const prisma = require("../database/prisma");

const Candidate = prisma.candidate;
const User = prisma.user;

class CandidateController {
    async Get(req, res, next) {
        const {
            page = req.query.page ?? 1,
            limit = req.query.limit ?? 6,
            sortByCreated = req.query.sortByCreated,
            sortByName = req.query.sortByName
        } = req.query;

        const pageOfNumber = parseInt(page),
            limitOfNumber = parseInt(limit);

        const offset = (pageOfNumber - 1) * limitOfNumber;

        await Candidate.findMany({
            include: {
                User: true
            },
            orderBy: {
                createdAt: sortByCreated,
                candidateName: sortByName,
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
                next(err);
            });
    };

    async GetByID(req, res, next) {
        const { id } = req.params;

        await Candidate.findUnique({
            where: {
                candidateID: parseInt(id)
            }
        }).then((candidate) => {
            !candidate
                ?
                res.status(404).json({
                    message: "Candidate Not Found",
                    status: 404
                })
                :
                res.status(200).json({
                    message: "OK",
                    data: candidate
                })

        }).catch((err) => {
            next(err);
        });
    }

    async Post(req, res, next) {
        const body = {
            candidateName: req.body.candidateName,
            candidateVisi: req.body.candidateVisi,
            candidateMisi: req.body.candidateMisi,
            candidateAvatar: req.body.candidateAvatar,
            candidateRole: req.body.candidateRole,
            group: req.body.group,
            level: req.body.level,
            createdBy: req.body.createdBy,
        };
        // const userID = req.body.createdBy;

        // const checkUser = await User.findUnique({ where: { id: userID } });

        // // check who create a candidate, if role ADMIN let him cook XD
        // (!checkUser)

        //     // if user not found
        //     ? res
        //         .status(404)
        //         .json({
        //             message: "User Not Found",
        //             status: 404
        //         })

        //     // if user role !== "ADMIN"
        //     : (checkUser.role !== "ADMIN")
        //         ? res
        //             .status(400)
        //             .json({
        //                 message: "You dont have access",
        //                 status: 400
        //             })

        //         // else, user role === ADMIN
        // :
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
            next(err);
        });
    };

    async Update(req, res, next) {
        const { id } = req.params;

        const checkCandidate = await Candidate.findUnique({
            where: {
                candidateID: parseInt(id)
            }
        });

        if (!checkCandidate) return res
            .status(404)
            .json({
                message: "Candidate Not Found",
                status: 404
            });

        const body = {
            candidateName: req.body.candidateName,
            candidateVisi: req.body.candidateVisi,
            candidateMisi: req.body.candidateMisi,
            candidateAvatar: req.body.candidateAvatar,
            candidateRole: req.body.candidateRole,
            group: req.body.group,
            level: req.body.level,
            createdBy: req.body.createdBy,
        };

        await Candidate.update({
            where: {
                candidateID: parseInt(id)
            }, data: body
        }).then((updated) => {
            if (updated) return res
                .status(200)
                .json({
                    message: "OK",
                    data: updated
                });
        }).catch((err) => {
            next(err);
        });
    };

    async Deleted(req, res, next) {
        const { id } = req.params;

        const checkCandidate = await Candidate.findUnique({ where: { candidateID: parseInt(id) } });

        if (!checkCandidate) return res
            .status(404)
            .json({
                message: "Candidate Not Found",
                status: 404
            });

        return await Candidate.delete({
            where: { candidateID: parseInt(id) }
        })
            .then((deletedCandidate) => {
                return res
                    .status(200)
                    .json({
                        message: "OK",
                        ststus: 200
                    })
            }).catch((err) => {
                next(err);
            });
    }
};

module.exports = new CandidateController();