import express from 'express';
import otpController from '../controller/otpController.js';
//
const router = express.Router();
//
router.post('/api/send_otp', otpController.sendEmailOTP);
//
router.post('/api/verify_otp', otpController.verifyOtpEmail);
//

module.exports = router;
