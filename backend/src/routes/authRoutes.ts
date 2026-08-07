import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = express.Router();

// new user route
router.post('/register', registerUser);

// old user login route
router.post('/login', loginUser);

export default router;