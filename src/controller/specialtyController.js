import { getTopSpecialtyService, getAllSpecialtyService, postInfoSpecialtyService, getSpecialtyByIdService, getInfoDoctorBelongSpecialtyService } from '../services/specicaltyService';
import { setDataRedisService } from '../services/redisService';
const getTopSpecialty = async (req, res) => {
    try {
        const response = await getTopSpecialtyService(req.query.limit);
        if (response.data) {
            const reply = await setDataRedisService(req.headers.key, response.data, 60 * 60 * 24);
            response.redis_store = reply;
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
        const response = await getInfoDoctorBelongSpecialtyService(req.query.type, req.query.provinceId);
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
