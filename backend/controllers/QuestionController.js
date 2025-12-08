import Users from "../models/Users.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";

export const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll({
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'name', 'username'],
                }
            ],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getQuestionsByTitle = async (req, res) => {
    const { title } = req.body;
    try {
        const question = await Question.findAll({
            where: {
                title: {
                    [Op.like]: `%${title}%`
                }
            },
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'name', 'username', 'image', 'url'],
                }
            ],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'name', 'username', 'image', 'url'],
                },
                {
                    model: Answer,
                    as: 'answers',
                    include: [
                        {
                            model: Users,
                            as: 'user',
                            attributes: ['id', 'name', 'username', 'image', 'url'],
                        },
                    ]
                }
            ],
        });
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getQuestionsByUserId = async (req, res) => {
    try {
        const questions = await Question.findAll({
            where: {
                userId: req.params.id
            },
            order: [['createdAt', 'DESC']],
        });
        if (!questions) return res.status(404).json({ message: "Tidak menemukan pertanyaan, kemungkinan pertanyaan sudah dihapus" });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getMyQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll({
            where: {
                userId: req.userId
            },
            order: [['createdAt', 'DESC']],
        });
        if (!questions) return res.status(404).json({ message: "Tidak menemukan pertanyaan, kemungkinan pertanyaan sudah dihapus" });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createQuestion = async (req, res) => {
    const { title, question } = req.body;
    const file = req.files ? req.files.file : null;

    try {
        if (file) {
            const size = file.data.length;
            const ext = path.extname(file.name);
            const uniqueIdentifier = Date.now();
            const fileName = `${file.md5}_${uniqueIdentifier}${ext}`;
            const url = `${req.protocol}://${req.get("host")}/img/question/${fileName}`;
            const allowedType = ['.jpeg', '.jpg', '.png'];

            if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Gambar harus berekstensi .jpeg, .jpg, dan .png" });

            if (size > 5000000) return res.status(422).json({ msg: "Ukuran file maksimal 5mb" });
            await Question.create({
                title: title,
                question: question,
                media: fileName,
                url: url,
                userId: req.userId
            });
            file.mv(`./public/img/question/${fileName}`, (err) => {
                if (err) return res.status(500).json({ msg: err.message });
            });
        } else {
            await Question.create({
                title: title,
                question: question,
                userId: req.userId
            });
        }
        res.status(201).json({ message: "Berhasil menambahkan pertanyaan" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const editQuestion = async (req, res) => {
    const { title, question } = req.body;
    const file = req.files ? req.files.file : null;

    try {
        const getImg = await Question.findOne({
            attributes: ['media', 'url'],
            where: {
                id: req.params.id
            }
        });

        if (file) {
            const size = file.data.length;
            const ext = path.extname(file.name);
            const uniqueIdentifier = Date.now();
            const fileName = `${file.md5}_${uniqueIdentifier}${ext}`;
            const url = `${req.protocol}://${req.get("host")}/img/question/${fileName}`;
            const allowedType = ['.jpeg', '.jpg', '.png'];

            if (!allowedType.includes(ext.toLowerCase())) {
                return res.status(422).json({ msg: "Gambar harus berekstensi .jpeg, .jpg, dan .png" });
            }
            if (size > 5000000) {
                return res.status(422).json({ msg: "Ukuran file maksimal 5mb" });
            }

            await Question.update({
                title: title,
                question: question,
                media: fileName,
                url: url,
            }, {
                where: {
                    id: req.params.id
                }
            });
            file.mv(`./public/img/question/${fileName}`, (err) => {
                if (err) {
                    return res.status(500).json({ msg: err.message });
                }
            });
            if (getImg.media) {
                const imagePath = `./public/img/question/${getImg.media}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            return res.status(500).json({ message: err.message });
                        }
                    });
                }
            }
        } else {
            if (getImg.media) {
                const imagePath = `./public/img/question/${getImg.media}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            return res.status(500).json({ message: err.message });
                        }
                    });
                }
            }
            await Question.update({
                title: title,
                question: question,
                media: null,
                url: null
            }, {
                where: {
                    id: req.params.id
                }
            });
        }
        res.status(200).json({ message: "Pertanyaan berhasil diedit" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteQuestion = async (req, res) => {
    try {

        const question = await Question.findOne({
            where: {
                [Op.and]: [
                    { id: req.params.id },
                    { userId: req.userId }
                ]
            }
        });
        if (!question) return res.status(404).json({ message: "Tidak menemukan pertanyaan, kemungkinan pertanyaan sudah dihapus" });
        const imagePath = `./public/img/question/${question.media}`;
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) return res.status(500).json({ message: err.message });
            });
        }
        await Question.destroy({
            where: {
                [Op.and]: [
                    { id: req.params.id },
                    { userId: req.userId }
                ]
            }
        });
        res.status(200).json({ message: "Pertanyaan berhasil dihapus" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}