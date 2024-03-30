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

        (role !== "PEMILIH" && role !== "ADMIN")

            ? res.status(400).json({ message: "Roles that don't exist", status: 400 })

            : await User.findMany({
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
                    const countPages = await User.count();

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

    async Post(req, res, next) {
        const body = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            role: req.body.role,
            fullName: req.body.fullName,
            address: req.body.address,
            age: req.body.age,
            workAt: req.body.workAt
        };

        await User.findUnique({
            where: {
                email: req.body.email
            }
        }).then(async (emailExist) => {
            if (emailExist) return res
                .status(400)
                .json({
                    message: "Email Already Exist",
                    status: 400
                })

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
                    console.log(err);
                });
        }).catch((err) => {
            console.log(err);
        });

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
            console.log(err);
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
            address: req.body.address,
            age: req.body.age,
            workAt: req.body.workAt
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
                console.log(err);
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
                console.log(err);
            });
    };
};


module.exports = new UserController();