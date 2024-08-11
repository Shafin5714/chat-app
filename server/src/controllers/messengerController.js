import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Message from '../models/messageModel.js';

const getLastMessage = async (userId, friendId) => {
  const message = await Message.findOne({
    $or: [
      {
        $and: [
          { senderId: { $eq: userId } },
          { receiverId: { $eq: friendId } },
        ],
      },
      {
        $and: [
          { senderId: { $eq: friendId } },
          { receiverId: { $eq: userId } },
        ],
      },
    ],
  }).sort({ updatedAt: -1 });

  return message;
};

export const getFriends = asyncHandler(async (req, res) => {
  const data = await User.find({ _id: { $ne: req.user.id } });

  const friends = await Promise.all(
    data.map(async (friend) => {
      return {
        friend,
        lastMessage: await getLastMessage(req.user._id, friend._id),
      };
    }),
  );

  res.status(200).json({ friends });
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
  const userId = req.user._id;
  const friendId = req.params.id;

  const getMessages = await Message.find({
    $or: [
      {
        $and: [
          { senderId: { $eq: userId } },
          { receiverId: { $eq: friendId } },
        ],
      },
      {
        $and: [
          { senderId: { $eq: friendId } },
          { receiverId: { $eq: userId } },
        ],
      },
    ],
  });

  // const getMessages = (await Message.find({})).filter(
  //   (message) =>
  //     (message.senderId.toString() === senderId.toString() &&
  //       message.receiverId.toString() === receiverId.toString()) ||
  //     (message.senderId.toString() === receiverId.toString() &&
  //       message.receiverId.toString() === senderId.toString()),
  // );

  res.status(200).json({
    success: true,
    messages: getMessages,
  });
});

export const sendImage = asyncHandler(async (req, res) => {
  if (req.file) {
    const { senderName, receiverId } = req.body;

    const insertMessage = await Message.create({
      senderId: req.user._id,
      senderName,
      receiverId,
      message: {
        text: '',
        image: '/uploads/' + req.file.filename,
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
            text: '',
            image: '/uploads/' + req.file.filename,
          },
          createdAt: insertMessage.createdAt,
        },
      });
    }
  } else {
    res.status(400);
    throw new Error('Image required.');
  }
});
