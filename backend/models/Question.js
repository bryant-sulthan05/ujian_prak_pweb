import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./Users.js";

const { DataTypes } = Sequelize;

const Question = db.define('question', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false,
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

Users.hasMany(Question)
Question.belongsTo(Users, { foreignKey: 'userId' });

export default Question;