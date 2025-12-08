import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 225]
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 225]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    tlp: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: true,
        }
    },
    image: {
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

export default Users;