import db from '../models';
import bcrypt from 'bcryptjs';
import _Otp from '../models.mongo/Otp.model';
import { hashData } from './authService';
import { sendOTPEmailService } from '../services/emailService';
//
const generateOtpSending = () => {
    return Math.floor(Math.random() * (999999 - 100000) + 12345);
};
const CreateOtp = async (email, otp) => {
    return await _Otp.create({
        email,
        otp: await hashData(otp),
    });
};
//
const sendEmailOTPService = (email) => {
    return new Promise(async (res, rej) => {
        try {
            const otp = generateOtpSending();
            await Promise.all([CreateOtp(email, otp), sendOTPEmailService(email, otp)]);
            res({
                errCode: 0,
                message: 'OK!',
            });
        } catch (error) {
            rej(error);
        }
    });
};
//
const verifyOtpEmailService = (email, otp) => {
    return new Promise(async (res, rej) => {
        try {
            if (!email || !otp) {
                res({
                    errCode: 1,
                    message: 'Missing!',
                });
            }
            //
            const _otps = await _Otp.find({
                email,
            });
            console.log(_otps[_otps.length - 1]);
            if (!_otps || !_otps.length)
                res({
                    errCode: 2,
                    message: 'OTP expired!',
                });
            if (_otps && _otps.length && _otps[_otps.length - 1]) {
                const isValidOtp = await bcrypt.compare(otp, _otps[_otps.length - 1].otp);
                //
                res({
                    errCode: isValidOtp ? 0 : 1,
                    message: isValidOtp ? 'OK!' : 'Invalid OTP!',
                });
                //
                isValidOtp && (await _Otp.deleteMany({ email }));
            }
        } catch (error) {
            rej(error);
        }
    });
};
//
module.exports = {
    sendEmailOTPService,
    verifyOtpEmailService,
};
