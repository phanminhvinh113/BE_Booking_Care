import db from '../models';
import { convertToImageBase64 } from '../helper/convertImage';
import { Op } from 'sequelize';
const getMessageService = (senderId, receiverId) => {
   return new Promise(async (res, rej) => {
      try {
         if (!senderId || !receiverId) {
            res({
               errCode: 1,
               message: 'Missing Parameters',
            });
         }
         const message = await db.Message.findAll({
            where: {
               [Op.or]: [
                  { senderId, receiverId },
                  { senderId: receiverId, receiverId: senderId },
               ],
            },
            attributes: ['senderId', 'text', 'time'],
         });
         if (message)
            res({
               errCode: 0,
               message: 'OK!',
               data: message,
            });
      } catch (error) {
         rej(error);
      }
   });
};
const getAllMessagePatientService = (doctorId) =>
   new Promise(async (res, rej) => {
      try {
         if (!doctorId) {
            res({
               errCode: 1,
               message: 'Missing Parameters',
            });
         }

         const conversation = await db.Conversation.findAll({
            where: {
               receiverId: doctorId,
            },
            attributes: ['senderId', 'receiverId'],
            include: [
               {
                  model: db.User,
                  attributes: ['id', 'firstName', 'lastName', 'roleId', 'image'],
               },
            ],
            raw: true,
            nest: true,
         });
         if (conversation) {
            convertToImageBase64(conversation);
            res({
               errCode: 0,
               message: 'OK!',
               data: conversation,
            });
         }
      } catch (error) {
         rej(error);
      }
   });
module.exports = {
   getMessageService,
   getAllMessagePatientService,
};
