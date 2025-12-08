import Users from "../models/Users.js";

export const verifyUser = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Mohon login terlebih dahulu" });
    }
    const user = await Users.findOne({
        where: {
            id: req.session.userId,
        },
    });
    if (!user) {
        return res.status(401).json({ message: "Pengguna tidak ditemukan" });
    }
    req.userId = user.id;
    next();
}