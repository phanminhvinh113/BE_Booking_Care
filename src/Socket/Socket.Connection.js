import { Server } from 'socket.io';
import db from '../models';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
dotenv.config();

const io = new Server(process.env.PORT_SOCKET, {
   cors: {
      origin: process.env.URL_REACT_CLIENT,
   },
});
// LIST ACTIVE USERs
let activeUsers = [];
// ADD USER ONLINE
const addNewUser = (userId, socketId) => {
   !activeUsers.some((user) => user.userId === userId) && activeUsers.push({ userId, socketId });
};
// REMOVE USER OFFLINE
const removeUser = async (socketId) => {
   return (activeUsers = activeUsers.filter((user) => user.socketId !== socketId));
};
//
const getUser = async (userId) => {
   return activeUsers.find((user) => user.userId === userId);
};
// //
io.on('connection', (socket) => {
   console.log('Socket Connected', {
      socketId: socket.id,
   });
   //
   socket.on('add-new-user', (userId) => {
      if (userId) addNewUser(userId, socket.id);
      io.emit('get-user-active', activeUsers);
   });
   //

   // MESSAGE
   socket.on('send-message', async (data) => {
      if (data && data.senderId && data.receiverId && data.text) {
         //
         await db.Message.create({
            ...data,
         });
         const [[conversation1, created1], [conversation2, created2], user] = await Promise.all([
            db.Conversation.findOrCreate({
               where: {
                  senderId: data.senderId,
                  receiverId: data.receiverId,
               },
               defaults: {
                  senderId: data.senderId,
                  receiverId: data.receiverId,
               },
            }),
            db.Conversation.findOrCreate({
               where: {
                  senderId: data.receiverId,
                  receiverId: data.senderId,
               },
               defaults: {
                  senderId: data.receiverId,
                  receiverId: data.senderId,
               },
            }),
            getUser(data.receiverId),
         ]);
         //
         if (!created1) {
            conversation1.changed('updatedAt', true);
            await conversation1.save();
         }
         //
         if (!created2) {
            conversation2.changed('updatedAt', true);
            await conversation2.save();
         }

         if (user) io.to(user.socketId).emit('get-message', data);
      }
   });

   //
   socket.on('disconnect', async () => {
      console.log('Client disconnected'); // Khi client disconnect thì log ra terminal.
      //
      await removeUser(socket.id);
      //
      io.emit('get-user-active', activeUsers);
   });
});
//

// //
export default io;
