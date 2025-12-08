import { Sequelize } from "sequelize";

const db = new Sequelize('uji_pweb_50423286', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;