// utils
import makeValidation from '@withvoid/make-validation';
// bcrypt
import bcrypt from 'bcrypt';
// models
import UserModel, { USER_TYPES } from '../models/User.js';

export default {
  signIn: async (req, res) => {
    try {
      const validation = makeValidation(types => ({
      	payload: req.body,
      	checks:{
      		email: { type: types.string },
      		password: { type: types.string }
      	}
      }));
      if (!validation.success) return res.status(400).json(validation);
      const { email, password } = req.body;
      const user = await UserModel.getUserByEmail(email);
      const match = await bcrypt.compare(password, user.password);
      return res.status(200).json({
      	success: true, user,
      	authorization: req.authToken,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
  signUp: async (req, res) => {
    try {
      const validation = makeValidation(types => ({
        payload: req.body,
        checks: {
          username: { type: types.string },
          email: { type: types.string},
          password: {type: types.string},
          type: { type: types.enum, options: { enum: USER_TYPES } },
        }
      }));
      if (!validation.success) return res.status(400).json(validation);

      const { username, type, email, password } = req.body;
      const passwordHashed = await bcrypt.hash(password, 10)
	  const user = await UserModel.createUser(username, email, passwordHashed ,type);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
}
