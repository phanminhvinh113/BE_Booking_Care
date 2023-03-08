import {
  postInfoClinicService,
  getTopClinicHomeService,
  getAllClinicService,
} from "../services/clinicService";
import client from "../helper/redis_connection";

const postInfoClinic = async (req, res) => {
  try {
    const response = await postInfoClinicService(req.body);
    if (response) return res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      errCode: -1,
      message: `Error ${error}`,
    });
  }
};
const getTopClinicHome = async (req, res) => {
  try {
    const response = await getTopClinicHomeService(req.query.limit);
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
const getAllClinic = async (req, res) => {
  try {
    const response = await getAllClinicService();
    if (response) return res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      errCode: -1,
      message: `Error ${error}`,
    });
  }
};
module.exports = {
  postInfoClinic,
  getTopClinicHome,
  getAllClinic,
};
