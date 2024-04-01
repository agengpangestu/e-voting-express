const prisma = require('../database/prisma');

const User = prisma.user;

const CandidateBodyRequired = (req, res, next) => {
    const { candidateRole, level, createdBy } = req.body;

    if (!candidateRole) return res
        .status(400)
        .json({
            message: "Please fill Candidate Role",
            status: 400
        });
    if (candidateRole !== "KETUA" && candidateRole !== "WAKIL_KETUA" && candidateRole !== "NONE" && candidateRole !== "PERORANGAN") return res
        .status(400)
        .json({
            message: "Role is not available",
            status: 400
        });
    if (!level) return res
        .status(400)
        .json({
            message: "Please fill Level",
            status: 400
        });
    if (level !== "ORGANISASI" && level !== "SEKOLAH" && level !== "DESA") return res
        .status(400)
        .json({
            message: "Level is not available",
            status: 400
        });
    if (!createdBy) return res
        .status(400)
        .json({
            message: "Please fill User",
            status: 400
        })

    next();

};

const CheckWhoCreated = async (req, res, next) => {
    const userID = req.body.createdBy;

    await User.findUnique({
        where: {
            id: userID
        }
    }).then((aUser) => {
        (!aUser)
            ? res
                .status(404)
                .json({
                    message: "User Not Found",
                    status: 404
                })
            : (aUser.role !== "ADMIN")
                ? res.status(400).json({
                    message: "You dont have access",
                    status: 400
                })
                : next();
    })
};

module.exports = { CandidateBodyRequired, CheckWhoCreated };