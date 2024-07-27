import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Message from '../models/messageModel.js';

export const getFriends = asyncHandler(async (req, res) => {
  const userList = await User.find({}).select('-password');

  const filteredList = userList.filter(
    (user) => user.id !== req.user._id.toString(),
  );
  res.status(200).json({ friends: filteredList });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { senderName, receiverId, message } = req.body;
  const insertMessage = await Message.create({
    senderId: req.user._id,
    senderName,
    receiverId,
    message: {
      text: message,
      image: '',
    },
  });

  if (insertMessage) {
    res.status(201).json({
      success: true,
      message: {
        senderId: req.user._id,
        senderName,
        receiverId,
        message: {
          text: message,
          image: '',
        },
        createdAt: insertMessage.createdAt,
      },
    });
  }
});

export const getMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params.id;
  const getMessages = (await Message.find({})).filter(
    (message) =>
      (message.senderId.toString() === senderId.toString() &&
        message.receiverId.toString() === receiverId.toString()) ||
      (message.senderId.toString() === receiverId.toString() &&
        message.receiverId.toString() === senderId.toString()),
  );

  res.status(200).json({
    success: true,
    messages: getMessages,
  });
});
