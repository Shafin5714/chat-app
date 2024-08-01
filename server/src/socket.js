import { Server as SocketIOServer } from 'socket.io';

const setUpSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const users = [];

  const addUser = (userId, socketId, userInfo) => {
    const checkUser = users.some((user) => user.userId === userId);
    if (!checkUser) {
      users.push({ userId, socketId, userInfo });
    }
  };

  const removeUser = (socketId) => {
    const index = users.findIndex((user) => user.socketId === socketId);
    if (index > -1) {
      users.splice(index, 1);
    }
  };

  io.on('connection', (socket) => {
    console.log(`User connected with socket ID : ${socket.id}`);
    socket.on('addUser', (userId, userInfo) => {
      addUser(userId, socket.id, userInfo);
      io.emit('getUser', users);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected socket ID ${socket.id}`);
      removeUser(socket.id);
      io.emit('getUser', users);
    });

    socket.on('sendMessage', (data) => {
      const user = users.find((user) => user.userId === data.receiverId);
      if (user) {
        socket.to(user.socketId).emit('getMessage', {
          senderId: data.senderId,
          senderName: data.senderName,
          receiverId: data.receiverId,
          createAt: data.time,
          message: {
            text: data.message.text,
            image: data.message.image,
          },
        });
      }
    });
  });
};

export default setUpSocket;
