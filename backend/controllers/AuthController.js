import Users from "../models/Users.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "Email tidak terdaftar" });
        }
        const match = await argon2.verify(user.password, password);
        if (!match) {
            return res.status(400).json({ message: "Password salah" });
        }
        req.session.userId = user.id;
        return res.status(200).json({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            tlp: user.tlp,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const Me = async (req, res) => {
    const user = await Users.findOne({
        attributes: ['id', 'name', 'username', 'email', 'image', 'url', 'tlp'],
        where: {
            id: req.session.userId
        }
    });
    res.status(200).json(user);
}

export const Logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Berhasil Logout" });
    });
}