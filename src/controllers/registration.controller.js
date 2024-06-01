const prisma = require("../database/prisma");

const User = prisma.user;
const IdentityVerif = prisma.identity_Verif;

class RegistrationController {
    async Post(req, res, next) {
        const body = {
            identityNumber: req.body.identityNumber,
            fullName: req.body.fullName
        };

        await IdentityVerif.findUnique({
            where: { NoKTP: body.identityNumber }
        }).then(async (result) => {

            if (!result) return res.status(400).json({ message: "Anda tidak terdaftar di pemilihan", status: 400 });
            if (result.fullName !== body.fullName) return res.json({ message: 'Nama tidak sama', status: 400 });

            await User.findUnique({
                where: { identityNumber: body.identityNumber, }
            }).then(async (ifSameData) => {

                if (!ifSameData)

                    return await User.create({
                        data: body
                    }).then((created) => {
                        res.status(200).json({ message: "OK", status: 201, token: "1234" })
                    })
                if (ifSameData.identityNumber === body.identityNumber) return res.status(200).json({ message: "Nomor identitas harus unik", status: 400 })

            })
        }).catch((err) => {
            next(err);
        })

        // await User.findUnique({
        //     where: { identityNumber: body.identityNumber }
        // }).then(async (resultIdentity) => {
        //     if (!resultIdentity) return res.status(404).json({ message: "Data tidak ditemukan" });
        //     await IdentityVerif.findUnique({
        //         select: { NoKTP: true },
        //         where: { NoKTP: resultIdentity.identityNumber }
        //     }).then((result) => {
        //         if (!result) return res.status(400).json({ message: "Maaf, anda tidak terdaftar" });
        //         // if (resultIdentity.identityNumber !== result.NoKTP) return res.json({ message: "Maaf, anda tidak terdaftar" })
        //     })

        //     return res.json({ message: "Anda sudah terdaftar", token: "12345678" })
        // }).catch((err) => {
        //     next(err);
        // });
    }
}

module.exports = new RegistrationController();