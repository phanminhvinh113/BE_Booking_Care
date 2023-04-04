import { sendEmailOTPService, verifyOtpEmailService } from '../services/otpService.js';

/////////////////// HANDLE SEND EMAIL VIA OTP ////////////////
const sendEmailOTP = async (req, res) => {
    try {
        const response = await sendEmailOTPService(req.body.email);
        if (response) return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({
            errCode: -1,
            message: `${error}`,
        });
    }
};
/////////////////// HANDLE VERIFY EMAIL VIA OTP ////////////////
const verifyOtpEmail = async (req, res) => {
    try {
        const response = await verifyOtpEmailService(req.body.email, req.body.otp);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({
            errCode: -1,
            message: `${error}`,
        });
    }
};
//
module.exports = {
    sendEmailOTP,
    verifyOtpEmail,
};
