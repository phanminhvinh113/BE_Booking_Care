import { postInfoClinicService, getTopClinicHomeService, getAllClinicService } from '../services/clinicService';
import { setDataRedisService } from '../services/redisService';

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
