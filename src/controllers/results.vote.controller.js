const prisma = require("../database/prisma");

class ResultsVote {

    async GetResults(req, res, next) {
        await prisma.candidate.findMany({
            include: { _count: { select: { Vote: true } } }
        })
            .then((result) => {
                const formatedResult = result.map(data => ({
                    id: data.candidateID,
                    name: data.candidateName,
                    group: data.group,
                    level: data.level,
                    election: data.electionID,
                    result_vote: data._count.Vote
                }))
                res.status(200).json({
                    message: "Result Vote",
                    status: 200,
                    data: formatedResult
                })
            }).catch((err) => {
                next(err)
            });
    };

    async GetResult(req, res, next) {
        const { id } = req.params;

        await prisma.candidate.findMany({
            where: { electionID: parseInt(id, 10) },
            include: {
                Election: true,
                _count: {
                    select: {
                        Vote: true
                    }
                }
            }
        }).then((result) => {

            const formatedResult = result.map(data => ({
                id: data.candidateID,
                name: data.candidateName,
                role: data.candidateRole,
                group: data.group,
                level: data.level,
                result_vote: data._count.Vote
            }))

            res.status(200).json({
                message: "Result Vote",
                status: 200,
                data: formatedResult
            })
        }).catch((err) => {
            next(err);
        });
    }
};

// setInterval(async () => {
//     try {
//         await prisma.candidate.findMany({
//             include: {
//                 Election: true,
//                 _count: {
//                     select: {
//                         Vote: true
//                     }
//                 }
//             }
//         }).then((result) => {

//             const formated = result.map(data => ({
//                 name: data.candidateName,
//                 role: data.candidateRole,
//                 group: data.group,
//                 level: data.level,
//                 election_id: data.electionID,
//                 schdule_name: data.Election.electionName,
//                 vote_result: data._count.Vote
//             }))
//             console.log(`result vote ${JSON.stringify(formated, null, 2)}`);
//         })

//     } catch (err) {
//         console.log(err);
//     }
// }, 5000);

module.exports = new ResultsVote();