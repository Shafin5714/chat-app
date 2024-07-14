import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { generateToken } from '../utils/generateToken.js';

//  register
export const registerUser = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const checkUser = await User.findOne({ email: req.body.email });
    if (checkUser) {
      res.status(409);
      throw new Error('User already exists');
    } else {
      const user = User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        image: req.file.filename,
      });
      if (user) {
        generateToken(user._id);
        res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
        });
      } else {
        res.status(400);
        throw new Error('Invalid user data');
      }
    }
  } else {
    res.status(400);
    throw new Error('Profile picture required.');
  }
});
