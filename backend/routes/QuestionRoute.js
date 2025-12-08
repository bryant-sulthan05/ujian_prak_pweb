import express from 'express';
import {
    getAllQuestions,
    getQuestionsByTitle,
    getQuestionById,
    getQuestionsByUserId,
    getMyQuestions,
    createQuestion,
    editQuestion,
    deleteQuestion
} from '../controllers/QuestionController.js';
import { verifyUser } from '../middleware/Auth.js';

const router = express.Router();

router.get('/', getAllQuestions);
router.get('/user-questions/:id', getQuestionsByUserId);
router.get('/question/:id', getQuestionById);
router.get('/my-questions', verifyUser, getMyQuestions);
router.post('/title', getQuestionsByTitle);
router.post('/add-question', verifyUser, createQuestion);
router.patch('/edit-question/:id', verifyUser, editQuestion);
router.delete('/delete-question/:id', verifyUser, deleteQuestion);

export default router;