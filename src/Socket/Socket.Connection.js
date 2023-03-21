import { Server } from 'socket.io';
import db from '../models';
import dotenv from 'dotenv';

dotenv.config();

const io = new Server(process.env.PORT_SOCKET, {
   cors: {
      origin: process.env.URL_REACT_CLIENT,
   },
});
// ACTIVE USERs
let activeUsers = [];

// //
io.on('connection', (socket) => {
   console.log('Socket Connected', {
      socketId: socket.id,
   });
   //
   socket.on('add-new-user', (userId) => {
      if (activeUsers.some((user) => user.userId === userId)) {
         activeUsers.forEach((user) => {
            if (user.userId === userId) {
               user.socketId = socket.id;
            }
         });
      } else {
         activeUsers.push({ userId, socketId: socket.id });
      }
   });
   //
   io.emit('get-user-active', activeUsers);
   // MESSAGE
   socket.on('send-message', async (data) => {
      console.log(data);
      if (data && data.senderId && data.receiverId && data.text) {
         //
         await db.Message.create({
            ...data,
         });
         //
         const [conversation, created] = await db.Conversation.findOrCreate({
            where: {
               senderId: data.senderId,
               receiverId: data.receiverId,
            },
            defaults: {
               senderId: data.senderId,
               receiverId: data.receiverId,
            },
         });
         io.emit('get-message', data);
      }
   });

   //
   socket.on('disconnect', () => {
      console.log('Client disconnected'); // Khi client disconnect thì log ra terminal.
      //
      activeUsers.filter((user) => user.socketId !== socket.id);
      //
      io.emit('get-user-active', activeUsers);
   });
});
//

// //
export default io;
