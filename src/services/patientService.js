import db from "../models";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { sendSimpleEmail } from "./emailService";
//
require("dotenv").config();
//
const buildUrlEmail = (token, doctorId) => {
  return `${process.env.URL_REACT_CLIENT}/verify-booking?token=${token}&doctorId=${doctorId}`;
};
const postInfoBookingMedicalService = (data) => {
  return new Promise(async (res, rej) => {
    const {
      emailDoctor,
      email,
      phonenumber,
      address,
      gender,
      timeType,
      time,
      date,
      namePatient,
      nameDoctor,
      doctorId,
    } = data;
    try {
      if (!data || !email || !phonenumber || !date || !doctorId) {
        res({
          errCode: 1,
          message: "Missing Parameter",
        });
      } else {
        const [user, created] = await db.User.findOrCreate({
          where: { email: data.email, roleId: "R3" },
          defaults: {
            email,
            phonenumber,
            address,
            gender,
            firstName: namePatient,
            roleId: "R3",
          },
        });
        if (user) {
          const token = uuidv4();
          const [schedule, created] = await db.Booking.findOrCreate({
            where: {
              patientId: user.id,
              timeType: timeType,
              doctorId: doctorId,
              date: date,
            },
            defaults: {
              patientId: user.id,
              doctorId,
              date,
              timeType,
              statusId: "S1",
              token,
            },
          });
          if (!created) {
            res({
              errCode: 1,
              message: "Lịch này mi đặt rồi thèn ngu!!!???",
              schedule,
            });
          } else {
            const baseUrlSend = buildUrlEmail(token, doctorId);
            await sendSimpleEmail({
              time,
              emailDoctor,
              email,
              date,
              namePatient,
              nameDoctor,
              baseUrlSend,
            });
            res({
              errCode: 0,
              message:
                "Đặt lịch thành công, vui lòng truy cập email của bạn để xác nhận!",
            });
          }
        }
      }
    } catch (error) {
      rej(error);
    }
  });
};
const verifyBookingPatientService = ({ token, doctorId }) => {
  return new Promise(async (res, rej) => {
    try {
      if (!token || !doctorId) {
        res({
          errCode: 1,
          message: "Missing Parameter",
        });
      } else {
        const booking = await db.Booking.findOne({
          where: { doctorId: doctorId, statusId: "S1" },
          raw: false,
        });
        if (booking) {
          booking.statusId = "S2";
          await booking.save();
          res({
            errCode: 0,
            message: "Verify Success!",
          });
        } else {
          res({
            errCode: 2,
            message: "Booking existed!",
          });
        }
      }
    } catch (error) {
      rej(error);
    }
  });
};
const evaluateMedicalDoctorService = (data) => {
  return new Promise(async (res, rej) => {
    try {
      const { token, doctorId, patientId, date } = data;
      if (!token || !doctorId || !patientId || !date) {
        res({
          errCode: 1,
          message: "Missing Parameter",
        });
      } else {
        const [evaluate, created] = await db.Evaluate.findOrCreate({
          where: { doctorId: doctorId, patientId: patientId, token: token },
          defaults: {
            ...data,
          },
          raw: false,
        });
        if (!created) {
          evaluate.set({
            ...data,
          });
          await evaluate.save();
          res({
            errCode: 0,
            message: "update!",
          });
        } else {
          res({
            errCode: 0,
            message: "Posted!",
          });
        }
      }
    } catch (error) {
      rej(error);
    }
  });
};
module.exports = {
  postInfoBookingMedicalService,
  verifyBookingPatientService,
  evaluateMedicalDoctorService,
};
