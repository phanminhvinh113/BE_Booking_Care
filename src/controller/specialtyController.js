import client from "../helper/redis_connection";
import {
  getTopSpecialtyService,
  getAllSpecialtyService,
  postInfoSpecialtyService,
  getSpecialtyByIdService,
  getInfoDoctorBelongSpecialtyService,
} from "../services/specicaltyService";
const getTopSpecialty = async (req, res) => {
  try {
    const response = await getTopSpecialtyService(req.query.limit);
    if (response.data) {
      await client.set(req.key, JSON.stringify(response.data), (err, reply) => {
        response.redis_store = err ? err : reply;
      });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      errCode: -1,
      message: `Error ${error}`,
    });
  }
};
const getAllSpecialty = async (req, res) => {
  try {
    const response = await getAllSpecialtyService();
    if (response) return res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      errCode: -1,
      message: `Error ${error}`,
    });
  }
};
const postInfoSpecialty = async (req, res) => {
  try {
    const response = await postInfoSpecialtyService(req.body);
    if (response) return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: `error ${error}`,
    });
  }
};
const getSpecialtyById = async (req, res) => {
  try {
    const response = await getSpecialtyByIdService(req.query.id);
    if (response) return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: `error ${error}`,
    });
  }
};
const getInfoDoctorBelongSpecialty = async (req, res) => {
  try {
    const response = await getInfoDoctorBelongSpecialtyService(
      req.query.type,
      req.query.provinceId
    );
    if (response) return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: `error ${error}`,
    });
  }
};
module.exports = {
  getTopSpecialty,
  getAllSpecialty,
  postInfoSpecialty,
  getSpecialtyById,
  getInfoDoctorBelongSpecialty,
};
