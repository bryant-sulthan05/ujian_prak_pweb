import Users from '../models/Users.js';
import argon2 from 'argon2';
import { Op } from 'sequelize';
import path from 'path';
import nodemailer from 'nodemailer';
import fs from 'fs';

const otpStore = new Map();

export const cekProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Users.findOne({
            where: {
                id,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const editProfile = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: { id: req.userId }
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        const {
            name,
            username,
            password,
            confPassword,
            email,
            tlp
        } = req.body;

        let hashPassword = user.password;

        if (password) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$!&*]).{8,}$/;

            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    msg: "Password minimal 8 karakter, mengandung huruf kapital, angka, dan simbol"
                });
            }

            if (password !== confPassword) {
                return res.status(400).json({
                    msg: "Password dan konfirmasi password tidak sama"
                });
            }

            hashPassword = await argon2.hash(password);
        }

        if (email || tlp) {
            const checkUser = await Users.findOne({
                where: {
                    id: { [Op.not]: user.id },
                    [Op.or]: [
                        email ? { email } : null,
                        tlp ? { tlp: tlp } : null
                    ].filter(Boolean)
                }
            });

            if (checkUser) {
                if (email && checkUser.email === email) {
                    return res.status(422).json({ msg: "Email sudah digunakan" });
                }
                if (tlp && checkUser.tlp === tlp) {
                    return res.status(422).json({ msg: "No. HP sudah digunakan" });
                }
            }
        }

        let fileName = user.image;
        let url = user.url;

        if (req.files && req.files.file) {
            const file = req.files.file;
            const ext = path.extname(file.name);
            const size = file.data.length;
            const allowedType = [".png", ".jpg", ".jpeg"];

            if (!allowedType.includes(ext.toLowerCase())) {
                return res.status(422).json({ msg: "Format gambar tidak valid" });
            }

            if (size > 5000000) {
                return res.status(422).json({ msg: "Ukuran gambar maksimal 5MB" });
            }

            if (user.image) {
                const oldPath = `./public/img/profile/${user.image}`;
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            const unique = Date.now();
            fileName = `${file.md5}_${unique}${ext}`;
            url = `${req.protocol}://${req.get("host")}/img/profile/${fileName}`;

            await file.mv(`./public/img/profile/${fileName}`);
        }

        await Users.update({
            name: name ?? user.name,
            username: username ?? user.username,
            password: hashPassword,
            image: fileName,
            url: url,
            email: email ?? user.email,
            tlp: tlp ?? user.tlp
        }, {
            where: { id: user.id }
        });

        res.status(200).json({ msg: "Profil berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const regUser = async (req, res) => {
    const { name, username, password, confPassword, email, tlp } = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$!&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ msg: 'Password setidaknya mengandung satu huruf kapital, angka, dan simbol (@,#,$,!,&,*), serta memiliki panjang minimal 8 karakter.' });
    }
    if (password !== confPassword) return res.status(400).json({ msg: 'password dan konfirmasi password tidak sama' });
    const hashPassword = await argon2.hash(password);
    const emailUser = await Users.findOne({
        attributes: ['email', 'tlp'],
        where: {
            [Op.or]: [{ email: req.body.email }, { tlp: req.body.tlp }]
        }
    });
    if (emailUser) {
        if (email === emailUser.email) {
            return res.status(422).json({ msg: 'Email sudah digunakan, gunakan email lain!' });
        }
        if (tlp === emailUser.tlp) {
            return res.status(422).json({ msg: 'No. Hp sudah digunakan, gunakan No. Hp lain!' });
        }
    }
    try {
        await Users.create({
            name: name,
            username: username,
            password: hashPassword,
            email: email,
            tlp: tlp
        });
        res.status(200).json({ msg: 'Registrasi berhasil' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const forgotPasswordRequest = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ where: { email } });
        if (!user) return res.status(404).json({ msg: 'Email tidak ditemukan' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bryantv0.2.0@gmail.com',
                pass: 'wugigxwdcqhpisrd'
            }
        });

        await transporter.sendMail({
            from: '"Support" <bryantv0.2.0@gmail.com>',
            to: email,
            subject: 'Kode OTP Reset Password',
            text: `Kode OTP Anda adalah: ${otp}`
        });

        res.status(200).json({ msg: 'OTP telah dikirim ke email' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    const data = otpStore.get(email);
    if (!data) return res.status(400).json({ msg: 'OTP tidak ditemukan atau kadaluarsa' });

    if (Date.now() > data.expires) {
        otpStore.delete(email);
        return res.status(400).json({ msg: 'OTP kadaluarsa' });
    }

    if (data.otp !== otp) {
        return res.status(400).json({ msg: 'OTP salah' });
    }

    res.status(200).json({ msg: 'OTP valid' });
};

export const resetPassword = async (req, res) => {
    const { email, password, confPassword } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ msg: 'Password dan konfirmasi tidak sama' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$!&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ msg: 'Password tidak sesuai format' });
    }

    try {
        const hashPassword = await argon2.hash(password);
        await Users.update({ password: hashPassword }, { where: { email } });

        otpStore.delete(email);
        res.status(200).json({ msg: 'Password berhasil direset' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
