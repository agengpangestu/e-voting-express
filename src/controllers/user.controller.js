const prisma = require("../database/prisma");

const User = prisma.user;

class UserController {
    async Get(req, res, next) {
        const {
            page = req.query.page ?? 1,
            limit = req.query.limit ?? 6,
            sortByCreated = req.query.sortByCreated,
            sortByName = req.query.sortByName,
            role = req.query.role
        } = req.query;

        const pageOfNumber = parseInt(page),
            limitOfNumber = parseInt(limit);

        const offset = (pageOfNumber - 1) * limitOfNumber;

        // (role !== "PEMILIH" && role !== "ADMIN")

        // ? res.status(400).json({ message: "Roles that don't exist", status: 400 })

        // : 
        await User.findMany({
            where: {
                role: role
            },
            orderBy: {
                createdAt: sortByCreated,
                fullName: sortByName,
            },
            take: limitOfNumber,
            skip: offset,
        })
            .then(async (users) => {
                const countAllPages = await User.count();
                const countWithRole = await User.count({
                    where: {
                        role: role
                    }
                });

                const totalPages = Math.ceil(countAllPages / limitOfNumber);
                const totalPagesROLE = Math.ceil(countWithRole / limitOfNumber);
                const currentPage = page ? +page : 0;

                res.json({
                    message: "OK",
                    currentPage: currentPage,
                    countAllPages: countAllPages,
                    countROLE: countWithRole,
                    page: pageOfNumber,
                    totalPages: totalPages,
                    totalPagesROLE: totalPagesROLE,
                    data: users,
                })
            }).catch((err) => {
                next(err);
            });
    };

    async Post(req, res, next) {
        const dirPath = `${req.protocol}://${req.get('host')}/public/images/identityCards/${req.file === undefined ? "" : req.file.filename}`;
        const body = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            role: req.body.role,
            fullName: req.body.fullName,
            age: req.body.age,
            identityNumber: req.body.identityNumber,
            identityPicture: dirPath
        };

        await User.create({
            data: body
        })
            .then((created) => {
                return res
                    .status(200)
                    .json({
                        message: "OK",
                        status: 200
                    })
            }).catch((err) => {
                next(err);
            });

        // await User.findUnique({
        //     where: {
        //         email: req.body.email
        //     }
        // }).then(async (emailExist) => {
        //     if (emailExist) return res
        //         .status(400)
        //         .json({
        //             message: "Email Already Exist",
        //             status: 400
        //         })

        //     await User.create({
        //         data: body
        //     })
        //         .then((created) => {
        //             return res
        //                 .status(200)
        //                 .json({
        //                     message: "OK",
        //                     status: 200
        //                 })
        //         }).catch((err) => {
        //             console.log(err);
        //         });
        // }).catch((err) => {
        //     next(err);
        // });

    };

    async GetByID(req, res, next) {
        const { id } = req.params;

        await User.findUnique({
            where: {
                id: parseInt(id)
            }
        }).then((result) => {
            if (!result) return res
                .status(404)
                .json({
                    message: "User not found",
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

        const checkUser = await User.findUnique({
            where: { id: parseInt(id) }
        })
        if (!checkUser) return res
            .status(404)
            .json({
                message: "User Not Found", status: 404
            })

        const body = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            role: req.body.role,
            fullName: req.body.fullName,
            age: req.body.age,
            identityNumber: req.body.identityNumber,
            identityPicture: req.body.identityPicture
        };

        await User.update({
            where: {
                id: parseInt(id)
            }, data: body
        })
            .then((updated) => {

                if (updated) return res
                    .status(200)
                    .json({
                        message: "OK", data: updated
                    });
            }).catch((err) => {
                next(err);
            });
    };

    async Deleted(req, res, next) {
        const { id } = req.params;

        const checkUser = await User.findUnique({ where: { id: parseInt(id) } })
        if (!checkUser) return res
            .status(404)
            .json({
                message: "User Not Found",
                status: 404
            });

        return await User.delete({
            where: { id: parseInt(id) }
        })
            .then((result) => {
                return res.status(200).json({ message: "OK", data: result })
            }).catch((err) => {
                next(err);
            });
    };
};


module.exports = new UserController();