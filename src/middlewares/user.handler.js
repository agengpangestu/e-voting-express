const prisma = require("../database/prisma");

const User = prisma.user;

const checkRole = async (req, res, next) => {
    const { role } = req.query.role;

    if (!role) return res.status(404).json({ message: "Roles Not Found", status: 404 });

    if (role !== "PEMILIH" && role !== "ADMIN") return res.status(400).json({ message: "Roles that don't exist", status: 400 });

    next();
};
const checkUsername = async (req, res, next) => {
    const { username, email, identityNumber } = req.body;

    const usernameExist = await User.findUnique({ where: { username: username } })
    const emailExist = await User.findUnique({ where: { email } });
    const identityNumberExist = await User.findUnique({ where: { identityNumber: identityNumber } })

    if (usernameExist) {
        return res.status(400).json({ message: "Username telah digunakan", status: 400 })
    } else if (emailExist) {
        return res.status(400).json({ message: "Email telah digunakan", status: 400 })
    } else if (identityNumberExist) {
        return res.status(400).json({ message: "Nomor identitas telah digunakan", status: 400 })
    }
    next();
};


module.exports = { checkRole, checkUsername };