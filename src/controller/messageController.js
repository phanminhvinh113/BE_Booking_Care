import db from '../models';
import { getMessageService, getAllMessagePatientService } from '../services/messageService';
const getMessage = async (req, res) => {
   try {
      const response = await getMessageService(req.query.senderId, req.query.receiverId);
      if (response) res.status(200).json(response);
   } catch (error) {
      res.json({
         errCode: -1,
         message: `Error: ${error}`,
      });
   }
};
const getAllMessagePatient = async (req, res) => {
   try {
      const response = await getAllMessagePatientService(req.query.doctorId);
      if (response) res.status(200).json(response);
   } catch (error) {
      res.status(400).json({
         errCode: -1,
         message: `Error: ${error}`,
      });
   }
};
module.exports = {
   getMessage,
   getAllMessagePatient,
};
