import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { generateToken } from '../utils/generateToken.js';

//  register
export const registerUser = asyncHandler(async (req, res) => {
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
        image: '/uploads/' + req.file.filename,
      });
      if (user) {
        res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id),
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

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
