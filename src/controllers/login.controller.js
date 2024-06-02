const bcrypt = require('bcrypt');
const prisma = require('../database/prisma');
const { generateToken } = require('../middlewares/auth');

const User = prisma.user;

class LoginController {
    async login(req, res, next) {
        const { username, password } = req.body;

        await User.findUnique({ where: { username: username } })
            .then(async (retrieved) => {
                (!retrieved)
                    ? res.status(404).json({ message: "Username tidak ditemukan", status: 404 })
                    : await bcrypt.compare(password, retrieved.password).then((ifMatching) => {
                        if (!ifMatching) return res.status(404).json({ message: "Password salah", status: 400 });

                        const token = generateToken(retrieved);
                        res.status(200).json({ message: "Log in success", token: token })

                    })
            }).catch((err) => {
                console.log(err);
                next(err);
            });
    }
}

module.exports = new LoginController();