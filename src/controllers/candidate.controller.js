const fs = require('fs');

const prisma = require("../database/prisma");

const Candidate = prisma.candidate;
const User = prisma.user;

class CandidateController {
    async Get(req, res, next) {
        const {
            page = req.query.page ?? 1,
            limit = req.query.limit ?? 6,
            sortByCreated = req.query.sortByCreated,
            sortByName = req.query.sortByName,
            level = req.query.level,
        } = req.query;

        const pageOfNumber = parseInt(page),
            limitOfNumber = parseInt(limit);

        const offset = (pageOfNumber - 1) * limitOfNumber;

        await Candidate.findMany({
            where: {
                level: level
            },
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
                const countWithLevel = await Candidate.count({
                    where: {
                        level: level
                    }
                });

                const totalPages = Math.ceil(countPages / limitOfNumber);
                const totalPagesLEVEL = Math.ceil(countWithLevel / limitOfNumber);
                const currentPage = page ? +page : 0;

                res.json({
                    message: "OK",
                    page: pageOfNumber,
                    countPages: countPages,
                    countLevel: countWithLevel,
                    totalPages: totalPages,
                    totalPagesLEVEL: totalPagesLEVEL,
                    currentPage: currentPage,
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
            },
            include: { Election: true, User: true }
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
        const dirPath = `${req.protocol}://${req.get('host')}/public/images/candidate/${req.file === undefined ? "" : req.file.filename}`;
        const body = {
            candidateName: req.body.candidateName,
            candidateVisi: req.body.candidateVisi,
            candidateMisi: req.body.candidateMisi,
            candidateAvatar: dirPath,
            candidateRole: req.body.candidateRole,
            group: req.body.group,
            level: req.body.level,
            createdBy: parseInt(req.body.createdBy),
            electionID: parseInt(req.body.electionID),
        };

        await Candidate.create({
            data: body
        }).then((data) => {
            if (data) return res
                .status(201)
                .json({
                    message: "OK",
                    status: 201,
                    data: data
                })
        }).catch((err) => {
            next(err);
        });
    };

    async Update(req, res, next) {
        const { id } = req.params;
        const dirPath = `${req.protocol}://${req.get('host')}/public/images/candidate/${req.file === undefined ? "" : req.file.filename}`;

        let candidateAvatar = null;

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

        if (req.file) {
            candidateAvatar = dirPath;
            const rmvFromDir = checkCandidate.candidateAvatar.replace(`${req.protocol}://${req.get('host')}/`, "");
            fs.unlink(rmvFromDir, async (err) => {
                console.log(err);
            })
        } else {
            candidateAvatar = checkCandidate.candidateAvatar;
        }

        const body = {
            candidateName: req.body.candidateName,
            candidateVisi: req.body.candidateVisi,
            candidateMisi: req.body.candidateMisi,
            candidateAvatar: candidateAvatar,
            candidateRole: req.body.candidateRole,
            group: req.body.group,
            level: req.body.level,
            createdBy: parseInt(req.body.createdBy),
            electionID: parseInt(req.body.electionID),
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
        const rmvFromDir = checkCandidate.candidateAvatar.replace(`${req.protocol}://${req.get('host')}/`, "")

        if (!checkCandidate) return res
            .status(404)
            .json({
                message: "Candidate Not Found",
                status: 404
            });
        else
            fs.unlink(rmvFromDir, async (err) => {
                console.log(err);
            })
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