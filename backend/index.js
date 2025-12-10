import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import fileUpload from "express-fileupload";
import db from './config/Database.js';
import SequelizeStore from 'connect-session-sequelize';
import UserRoute from './routes/UserRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import QuestionRoute from './routes/QuestionRoute.js';
import AnswerRoute from './routes/AnswerRoute.js';

dotenv.config();

const app = express();

// (async () => {
//     await db.sync();
// })();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(UserRoute);
app.use(AuthRoute);
app.use(QuestionRoute);
app.use(AnswerRoute);

// store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log('Server is running...');
});
