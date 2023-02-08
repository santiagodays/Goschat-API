// utils
import makeValidation from '@withvoid/make-validation'; // Maybe implement it yourself, its a bit an overkiller to import a validator
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

      console.log("match:" + match) // maybe a better explanation of this ? 
      
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
          firstName: { type: types.string },
          lastName: { type: types.string },
          email: { type: types.string},
          password: {type: types.string},
          type: { type: types.enum, options: { enum: USER_TYPES } },
        }
      }));

      if (!validation.success) return res.status(400).json(validation);

      const { firstName, lastName, type, email, password } = req.body;
      const passwordHashed = await bcrypt.hash(password, 10);
	    const user = await UserModel.createUser(firstName, lastName, email, passwordHashed ,type);

      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
}