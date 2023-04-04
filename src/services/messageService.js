import db from '../models';
import { convertToImageBase64 } from '../helper/convertImage';
import { Op } from 'sequelize';
const getMessageService = (senderId, receiverId, offset, limit) => {
   return new Promise(async (res, rej) => {
      try {
         if (!senderId || !receiverId) {
            res({
               errCode: 1,
               message: 'Missing Parameters',
            });
         }
         const message = await db.Message.findAll({
            offset: offset ? offset : 0,
            limit: limit ? limit : 20,
            where: {
               [Op.or]: [
                  { senderId, receiverId },
                  { senderId: receiverId, receiverId: senderId },
               ],
            },
            order: [
               ['createdAt', 'DESC'], // Sorts by COLUMN_NAME_EXAMPLE in ascending order
            ],
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
            limit: 10,

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
            order: [['updatedAt', 'DESC']],
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
