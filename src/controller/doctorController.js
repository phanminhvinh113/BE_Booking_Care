import {
  getTopDoctorHomeService,
  getAllDoctorService,
  postInfoDoctorService,
  getDetailInfoDoctorService,
  bulkCreateScheduleService,
  getScheduleDoctorByDateService,
  getListPatientBooingMedicalService,
  completeConfirmMedicalService,
  getFeedbackDoctorService,
} from "../services/doctorService";
import client from "../helper/redis_connection";

const getTopDoctorHome = async (req, res) => {
  try {
    const limit = req.query.limit;
    const response = await getTopDoctorHomeService(limit);
    if (response) {
      // req.data = response;
      // req.key = req.headers.key;
      // next();
      await client.set(req.key, JSON.stringify(response), (err, reply) => {
        return res.status(200).json({
          errCode: 0,
          message: "OK!",
          data: response,
          redis_store: err ? err : reply,
        });
      });
    } else {
      return res.status(400).json({
        errCode: 1,
        message: "No response from sever!",
      });
    }
  } catch (error) {
    return res.status(404).json({
      errCode: -1,
      message: `Failed! ERROR : ${error}`,
    });
  }
};

const getAllDoctor = async (req, res) => {
  try {
    const response = await getAllDoctorService();
    if (response) {
      return res.status(200).json(response);
    } else {
      return res.status(200).json({
        errCode: 1,
        errMessage: "No response",
      });
    }
  } catch (error) {
    res.status(400).json({
      errCode: -1,
      errMessage: " Error from sever ",
    });
  }
};
const postInfoDoctor = async (req, res) => {
  try {
    const response = await postInfoDoctorService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      errMessage: `Post data failed!: ${error}`,
    });
  }
};

const getDetailInfoDoctor = async (req, res) => {
  try {
    const response = await getDetailInfoDoctorService(req.query.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errorCode: -1,
      message: `Error ${error}`,
    });
  }
};
const bulkCreateSchedule = async (req, res) => {
  try {
    const response = await bulkCreateScheduleService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: `Error: ${error}`,
    });
  }
};
const getScheduleDoctorByDate = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    const response = await getScheduleDoctorByDateService(doctorId, +date);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: error,
    });
  }
};
const getListPatientBooingMedical = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    const response = await getListPatientBooingMedicalService(doctorId, +date);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: error,
    });
  }
};
const completeConfirmMedical = async (req, res) => {
  try {
    const response = await completeConfirmMedicalService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: `error: ${error}`,
    });
  }
};
const getFeedbackDoctor = async (req, res) => {
  try {
    const response = await getFeedbackDoctorService(req.query.doctorId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: `error: ${error}`,
    });
  }
};
module.exports = {
  getTopDoctorHome,
  getAllDoctor,
  postInfoDoctor,
  getDetailInfoDoctor,
  bulkCreateSchedule,
  getScheduleDoctorByDate,
  getListPatientBooingMedical,
  completeConfirmMedical,
  getFeedbackDoctor,
};
