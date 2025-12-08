import express from 'express';
import {
    getMyAnswerRecords,
    getAnswerByUser,
    postAnswer,
    updateAnswer,
    deleteAnswer,
    getAllAnswers,
} from '../controllers/AnswerController.js';
import { verifyUser } from '../middleware/Auth.js';

const router = express.Router();

router.get('/count-answer', getAllAnswers);
router.get('/my-answers', verifyUser, getMyAnswerRecords);
router.get('/user-answers/:id', getAnswerByUser);
router.post('/post-answer/:id', verifyUser, postAnswer);
router.patch('/update-answer/:id', verifyUser, updateAnswer);
router.delete('/delete-answer/:id', verifyUser, deleteAnswer);

export default router;