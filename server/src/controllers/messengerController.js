import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

export const getFriends = asyncHandler(async (req, res) => {
  const userList = await User.find({}).select('-password');

  const filteredList = userList.filter(
    (user) => user.id !== req.user._id.toString(),
  );
  res.status(200).json({ friends: filteredList });
});
