import express from 'express';
// controllers
import users from '../controllers/user.js';
import auth from '../controllers/auth.js';
// middlewares
import { encode } from '../middlewares/jwt.js';

const router = express.Router();

router
  .post('/sign_up', auth.signUp)
  .post('/sign_in', encode, auth.signIn)

export default router;
