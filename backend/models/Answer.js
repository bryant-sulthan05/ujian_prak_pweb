import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./Users.js";
import Question from "./Question.js";

const { DataTypes } = Sequelize;
const Answer = db.define('answer', {
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    media: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    freezeTableName: true
});

Users.hasMany(Answer)
Answer.belongsTo(Users, { foreignKey: 'userId' });

Question.hasMany(Answer)
Answer.belongsTo(Question, { foreignKey: 'questionId' });

export default Answer;