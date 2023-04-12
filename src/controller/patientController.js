import {
    postInfoBookingMedicalService,
    verifyBookingPatientService,
    evaluateMedicalDoctorService,
    commentEvaluteMicalService,
} from '../services/patientService';

const postInfoBookingMedical = async (req, res) => {
    try {
        const response = await postInfoBookingMedicalService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({
            errCode: -1,
            message: `Error: ${error}`,
        });
    }
};
const verifyBookingPatient = async (req, res) => {
    try {
        const response = await verifyBookingPatientService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({
            errCode: -1,
            message: `Error: ${error}`,
        });
    }
};
const evaluateMedicalDoctor = async (req, res) => {
    try {
        const response = await evaluateMedicalDoctorService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({
            errCode: -1,
            message: `Error: ${error}`,
        });
    }
};
const commentEvaluteMical = async (req, res) => {
    try {
        const response = await commentEvaluteMicalService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({
            errCode: -1,
            message: `Error: ${error}`,
        });
    }
};
module.exports = {
    postInfoBookingMedical,
    verifyBookingPatient,
    evaluateMedicalDoctor,
    commentEvaluteMical,
};
