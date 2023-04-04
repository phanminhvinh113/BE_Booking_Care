import { Schema, model } from 'mongoose';

//
const _Otp = new Schema(
    {
        email: String,
        otp: String,
    },
    { timestamps: true },
    {
        collection: 'otp',
    },
);
_Otp.index({ createdAt: 1 }, { expireAfterSeconds: 120 });
//
module.exports = model('otp', _Otp);
