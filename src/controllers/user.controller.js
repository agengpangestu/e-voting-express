const prisma = require("../database/prisma");

const User = prisma.user;

class UserController {
    async Get(req, res, next) {

        const user = await prisma.user.findMany()
        console.log();
        res.json({ message: `hello user`, data: user })
    }

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

        await prisma.user.create({
            data: body
        })
            .then((created) => {
                console.log(res.json({ data: created }));
            }).catch((err) => {
                console.log(err);
            });
    }

    async GetByID(req, res, next) {
        const { id } = req.params;

        await prisma.user.findUnique({
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
    }

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

        await prisma.user.update({
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
    }

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
    }
}


module.exports = new UserController();