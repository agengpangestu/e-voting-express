const cron = require('node-cron');

const prisma = require("../database/prisma")

const ElectionSchedule = prisma.election_Schedulling;

//tidak mau update otomatis
async function CheckElectionStatus(req, res, next) {

    try {
        const currentTime = new Date();

        const elections = await ElectionSchedule.findMany();

        for (const election of elections) {
            const { electionID, status, startedAt, endedAt } = election;

            if (currentTime.getTime() >= startedAt && currentTime.getTime() <= endedAt) {


                if (status !== "ACTIVE") {
                    await ElectionSchedule.update({
                        where: { electionID: electionID },
                        data: { status: "ACTIVE" }
                    });
                    console.log(`Schedule ID ${electionID} has been actived`);
                }
            } else {


                if (status !== "CLOSED") {
                    await ElectionSchedule.update({
                        where: { electionID: electionID },
                        data: { status: "CLOSED" }
                    });
                    console.log(`Schedule ID ${electionID} has been closed`);
                }
            }

        }
    } catch (err) {
        next(err);
    }
};
cron.schedule('*/1 * * * *', async (req, res, next) => {
    await CheckElectionStatus()
}, {
    scheduled: true,
    timezone: 'Asia/Jakarta'
})

class ElectionScheduleController {
    async Get(req, res, next) {
        await ElectionSchedule.findMany()
            .then((result) => {

                return res
                    .status(200)
                    .json({
                        message: "OK",
                        data: result
                    });
            }).catch((err) => {
                next(err);
            });
    };

    async Post(req, res, next) {
        const body = {
            electionName: req.body.electionName,
            electionDesc: req.body.electionDesc,
            createdBy: req.body.createdBy,
            status: req.body.status,
            startedAt: req.body.startedAt,
            endedAt: req.body.endedAt,
        };

        await ElectionSchedule.create({
            data: body
        }).then((created) => {
            return res
                .status(201)
                .json({
                    message: "OK",
                    status: 201,
                    data: created
                });
        }).catch((err) => {
            console.log(err);
            next(err);
        });
    };

    async GetByID(req, res, next) {
        const { id } = req.params;

        await ElectionSchedule.findUnique({
            where: {
                electionID: parseInt(id)
            }
        }).then((result) => {
            if (!result) return res
                .status(404)
                .json({
                    message: "Schedule not found",
                    status: 404
                })

            return res
                .status(200)
                .json({ message: "OK", data: result });
        }).catch((err) => {
            next(err);
        });
    };

    async Update(req, res, next) {
        const { id } = req.params;

        const checkSchedule = await ElectionSchedule.findUnique({
            where: {
                electionID: parseInt(id)
            }
        });

        if (!checkSchedule) return res
            .status(404)
            .json({
                message: "Schedule Not Found",
                status: 404
            });

        const body = {
            electionName: req.body.electionName,
            electionDesc: req.body.electionDesc,
            createdBy: req.body.createdBy,
            status: req.body.status,
            startedAt: req.body.startedAt,
            endedAt: req.body.endedAt,
        };

        await ElectionSchedule.update({
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

        const checkSchedule = await ElectionSchedule.findUnique({ where: { electionID: parseInt(id) } })
        if (!checkSchedule) return res
            .status(404)
            .json({
                message: "Schedule Not Found",
                status: 404
            });

        return await ElectionSchedule.delete({
            where: { electionID: parseInt(id) }
        })
            .then((result) => {
                return res.status(200).json({ message: "OK", status: 200 })
            }).catch((err) => {
                next(err);
            });
    };
}

module.exports = new ElectionScheduleController();