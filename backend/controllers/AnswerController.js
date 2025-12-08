import Users from "../models/Users.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import { Op, Sequelize } from "sequelize";
import path from "path";
import fs from "fs";

export const getAllAnswers = async (req, res) => {
    try {
        const answerCounts = await Answer.findAll({
            attributes: [
                'questionId',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'answerCount']
            ],
            group: ['questionId']
        });
        const result = {};
        answerCounts.forEach(item => {
            result[item.questionId] = parseInt(item.dataValues.answerCount, 10);
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getMyAnswerRecords = async (req, res) => {
    try {
        const id = req.userId;
        const answers = await Answer.findAll({
            where: {
                userId: id
            },
            include: [
                {
                    model: Question,
                    as: 'question',
                    attributes: ['id', 'title'],
                    include: [
                        {
                            model: Users,
                            as: 'user',
                            attributes: ['id', 'name', 'username', 'image', 'url']
                        }
                    ]
                }
            ]
        });
        res.status(200).json(answers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAnswerByUser = async (req, res) => {
    try {
        const { id } = req.params;
        const answers = await Answer.findAll({
            where: {
                userId: id
            },
            include: [
                {
                    model: Question,
                    as: 'question',
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(answers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const postAnswer = async (req, res) => {
    const questionId = req.params.id;
    const { answer } = req.body;
    const file = req.files ? req.files.file : null;

    try {
        if (file) {
            const size = file.data.length;
            const ext = path.extname(file.name);
            const uniqueIdentifier = Date.now();
            const fileName = `${file.md5}_${uniqueIdentifier}${ext}`;
            const url = `${req.protocol}://${req.get("host")}/img/answer/${fileName}`;
            const allowedType = ['.jpeg', '.jpg', '.png'];

            if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Gambar harus berekstensi .jpeg, .jpg, dan .png" });

            if (size > 5000000) return res.status(422).json({ msg: "Ukuran file maksimal 5mb" });
            await Answer.create({
                questionId: questionId,
                userId: req.userId,
                answer: answer,
                media: fileName,
                url: url
            });
            file.mv(`./public/img/answer/${fileName}`, (err) => {
                if (err) return res.status(500).json({ msg: err.message });
            });
        } else {
            await Answer.create({
                questionId: questionId,
                userId: req.userId,
                answer: answer
            });
        }
        res.status(201).json({ msg: "Jawaban terkirim" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateAnswer = async (req, res) => {
    const { answer } = req.body;
    const file = req.files ? req.files.file : null;

    try {
        const getImg = await Answer.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!getImg) {
            return res.status(404).json({ msg: "Jawaban tidak ditemukan" });
        }

        if (file) {
            const size = file.data.length;
            const ext = path.extname(file.name);
            const uniqueIdentifier = Date.now();
            const fileName = `${file.md5}_${uniqueIdentifier}${ext}`;
            const url = `${req.protocol}://${req.get("host")}/img/answer/${fileName}`;
            const allowedType = ['.jpeg', '.jpg', '.png'];

            if (!allowedType.includes(ext.toLowerCase())) {
                return res.status(422).json({ msg: "Gambar harus berekstensi .jpeg, .jpg, dan .png" });
            }
            if (size > 5000000) {
                return res.status(422).json({ msg: "Ukuran file maksimal 5mb" });
            }

            await Answer.update({
                answer: answer,
                media: fileName,
                url: url,
            }, {
                where: {
                    id: req.params.id
                }
            });

            file.mv(`./public/img/answer/${fileName}`, (err) => {
                if (err) {
                    return res.status(500).json({ msg: err.message });
                }
            });

            if (getImg.media) {
                const imagePath = `./public/img/answer/${getImg.media}`;
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
                const imagePath = `./public/img/answer/${getImg.media}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            return res.status(500).json({ message: err.message });
                        }
                    });
                }
            }
            await Answer.update({
                answer: answer,
                media: null,
                url: null
            }, {
                where: {
                    id: req.params.id
                }
            });
        }
        res.status(200).json({ message: "Jawaban berhasil diedit" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAnswer = async (req, res) => {
    try {
        const answerData = await Answer.findOne({
            where: {
                [Op.and]: [
                    { id: req.params.id },
                    { userId: req.userId }
                ]
            }
        });
        if (!answerData) return res.status(404).json({ msg: "Jawaban tidak ditemukan" });
        if (answerData.media) {
            fs.unlink(`./public/img/answer/${answerData.media}`, (err) => {
                if (err) console.log(err);
            });
        }
        await Answer.destroy({
            where: {
                [Op.and]: [
                    { id: req.params.id },
                    { userId: req.userId }
                ]
            }
        });
        res.status(200).json({ msg: "Jawaban berhasil dihapus" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}