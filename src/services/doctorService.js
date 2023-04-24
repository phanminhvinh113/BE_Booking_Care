import db from '../models';
import _ from 'lodash';
import { convertToImageBase64 } from '../helper/convertImage';
import { sendEmailCofirmBill } from './emailService';

require('dotenv').config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
const buildUrlEmail = (token, patientId, doctorId) => {
    return `${process.env.URL_REACT_CLIENT}/confirm-booking-medical?token=${token}&patientId=${patientId}&doctorId=${doctorId}`;
};
const getTopDoctorHomeService = (limit) => {
    return new Promise(async (res, rej) => {
        try {
            const doctors = await db.User.findAll({
                limit: +limit || 8,
                where: {
                    roleId: 'R2',
                },
                attributes: {
                    exclude: [
                        'password',
                        'deletedAt',
                        'positionId',
                        'roleId',
                        'typeRole',
                        'updatedAt',
                        'keyRole',
                        'gender',
                        'createdAt',
                        'address',
                        'phonenumber',
                    ],
                },
                include: [
                    {
                        model: db.AllCodes,
                        as: 'positionData',
                        attributes: ['valueEN', 'valueVI'],
                    },
                    {
                        model: db.AllCodes,
                        as: 'genderData',
                        attributes: ['valueEN', 'valueVI'],
                    },
                    {
                        model: db.DoctorInfo,
                        attributes: ['name', 'nameClinic', 'addressClinic'],
                        include: [
                            {
                                model: db.AllCodes,
                                as: 'specs',
                                attributes: ['valueEN', 'valueVI'],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            //
            convertToImageBase64(doctors);
            //
            res(doctors);
            //
        } catch (error) {
            rej({
                errCode: -1,
                message: 'Failed!',
            });
        }
    });
};

const getAllDoctorService = () => {
    return new Promise(async (res, rej) => {
        try {
            const doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'deletedAt'],
                },
                include: [
                    {
                        model: db.AllCodes,
                        as: 'positionData',
                        attributes: ['valueEN', 'valueVI'],
                    },
                    {
                        model: db.AllCodes,
                        as: 'genderData',
                        attributes: ['valueEN', 'valueVI'],
                    },
                ],
                raw: true,
                nest: true,
            });
            if (doctors) {
                convertToImageBase64(doctors);
                res({
                    errCode: 0,
                    message: 'OK!',
                    doctors,
                });
            } else {
                res({
                    errCode: 0,
                    message: 'OK',
                    doctors: [],
                });
            }
        } catch (error) {
            rej(error);
        }
    });
};

const postInfoDoctorService = (inputData) => {
    return new Promise(async (res, rej) => {
        try {
            const {
                name,
                description,
                contentMarkdown,
                contentHtml,
                doctorId,
                nameClinic,
                addressClinic,
                action,
                priceId,
                paymentId,
                provinceId,
                specialtyId,
                clinicId,
            } = inputData;
            if (
                (!name,
                !doctorId ||
                    !description ||
                    !contentMarkdown ||
                    !action ||
                    !nameClinic ||
                    !addressClinic ||
                    !priceId ||
                    !paymentId ||
                    !provinceId ||
                    !specialtyId)
            ) {
                res({
                    errCode: 1,
                    message: ' Missing Parameters',
                });
            } else {
                if (action === 'CREATE') {
                    await db.Markdown.create({
                        doctorId: doctorId,
                        description: description,
                        contentHTML: contentHtml,
                        contentMarkdown: contentMarkdown,
                        specialtyId,
                        clinicId,
                    });
                    await db.DoctorInfo.create({
                        name,
                        doctorId,
                        nameClinic,
                        addressClinic,
                        priceId,
                        paymentId,
                        provinceId,
                        specialtyId,
                    });
                    res({
                        errCode: 0,
                        message: 'Post Succed!',
                    });
                } else if (action === 'EDIT') {
                    const doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: doctorId },
                        raw: false,
                    });
                    const doctorInfoClinic = await db.DoctorInfo.findOne({
                        where: { doctorId: doctorId },
                        raw: false,
                    });
                    if (!doctorInfoClinic) {
                        await db.DoctorInfo.create({
                            doctorId,
                            nameClinic,
                            addressClinic,
                            priceId,
                            paymentId,
                            provinceId,
                            specialtyId,
                        });
                    } else {
                        if (inputData.image) {
                            const doctor = await db.User.findOne({
                                where: { id: doctorId },
                                raw: false,
                            });
                            doctor.set({
                                image: inputData.image,
                            });
                            await doctor.save();
                        } else {
                            doctorInfoClinic.set({
                                name,
                                nameClinic,
                                addressClinic,
                                priceId,
                                paymentId,
                                provinceId,
                                specialtyId,
                            });
                        }
                        doctorInfoClinic.set({
                            name,
                            nameClinic,
                            addressClinic,
                            priceId,
                            paymentId,
                            provinceId,
                            specialtyId,
                        });
                        await doctorInfoClinic.save();
                    }
                    if (doctorMarkdown) {
                        doctorMarkdown.set({
                            description: description,
                            contentHTML: contentHtml,
                            contentMarkdown: contentMarkdown,
                            specialtyId,
                            clinicId,
                        });
                        await doctorMarkdown.save();
                        res({
                            errCode: 0,
                            message: 'Update Succed!',
                        });
                    } else {
                        res({
                            errCode: 1,
                            message: 'Not Found Doctor!',
                        });
                    }
                }
            }
        } catch (error) {
            rej(error);
        }
    });
};

const getDetailInfoDoctorService = (doctorId) => {
    return new Promise(async (res, rej) => {
        try {
            if (!doctorId) {
                res({
                    errCode: -1,
                    message: 'Missing Parameters',
                });
            } else {
                const infoDoctor = await db.User.findOne({
                    where: { id: doctorId, roleId: 'R2' },
                    attributes: {
                        exclude: [
                            'password',
                            'gender',
                            'createdAt',
                            'address',
                            'roleId',
                            'deletedAt',
                            'keyRole',
                            'phonenumber',
                            'typeRole',
                            'updatedAt',
                            'email',
                            'positionId',
                        ],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['contentHTML', 'contentMarkdown', 'description', 'specialtyId', 'clinicId'],
                        },
                        {
                            model: db.DoctorInfo,
                            attributes: ['name', 'nameClinic', 'addressClinic', 'provinceId', 'priceId', 'paymentId', 'specialtyId'],
                            include: [
                                {
                                    model: db.AllCodes,
                                    as: 'province',
                                    attributes: ['valueEN', 'valueVI'],
                                },
                                {
                                    model: db.AllCodes,
                                    as: 'price',
                                    attributes: ['valueEN', 'valueVI'],
                                },
                                {
                                    model: db.AllCodes,
                                    as: 'payment',
                                    attributes: ['valueEN', 'valueVI'],
                                },
                                {
                                    model: db.AllCodes,
                                    as: 'specs',
                                    attributes: ['valueEN', 'valueVI'],
                                },
                            ],
                        },
                        {
                            model: db.AllCodes,
                            as: 'positionData',
                            attributes: ['valueEN', 'valueVI'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                infoDoctor.image = Buffer.from(infoDoctor.image, 'base64').toString('binary');
                res({
                    errCode: 0,
                    message: 'OK!',
                    data: infoDoctor,
                });
            }
        } catch (error) {
            rej(error);
        }
    });
};

const bulkCreateScheduleService = (data) => {
    return new Promise(async (res, rej) => {
        try {
            if (!data.arrSchedule || !data.arrSchedule.length) {
                res({
                    errCode: 1,
                    message: 'Missing Parameter',
                });
            } else {
                const schedule = data.arrSchedule.map((item) => {
                    item.maxNumber = +MAX_NUMBER_SCHEDULE;
                    return item;
                });
                /// FIND EXIST SCHEDULE IN DB //////
                const existSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: data.doctorId,
                        date: data.date,
                    },
                    attributes: ['timeType', 'date', 'maxNumber'],
                    raw: true,
                });
                ///// CONVERT DATE FORMAT TO TIMESTAMP ////////
                existSchedule.forEach((element) => {
                    element.date = new Date(element.date).getTime();
                });
                if (existSchedule && !!existSchedule.length) {
                    /// COMPARE DATA SCHEDULE SENDING TO DATA BASE AND EXIST SCHEDULE ///////
                    const newSchedule = _.differenceWith(schedule, existSchedule, (a, b) => {
                        return a.timeType === b.timeType;
                    });
                    ////// VALIDATE AND SAVE NEW UNIQUE SCHEDULE IN DAY //////
                    if (!newSchedule.length) {
                        res({
                            errCode: 3,
                            message: 'All of time is scheduled!',
                        });
                    }
                    //// POST TO DATA BASE NEW SCHEDULE /////
                    await db.Schedule.bulkCreate(newSchedule);
                } else {
                    //// IF NO ONE REPEATED /////
                    await db.Schedule.bulkCreate(schedule);
                }
                res({
                    errCode: 0,
                    message: 'Saved!',
                });
            }
        } catch (error) {
            rej(error);
        }
    });
};

const getScheduleDoctorByDateService = (doctorId, date) => {
    return new Promise(async (res, rej) => {
        try {
            if (!doctorId || !date) {
                res({
                    errCode: 1,
                    message: 'Missing Parameter',
                });
            } else {
                const scheduleDoctor = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        {
                            model: db.AllCodes,
                            as: 'timeTypeData',
                            attributes: ['valueEN', 'valueVI'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                res({
                    errCode: 0,
                    message: 'OK!',
                    data: scheduleDoctor,
                });
            }
        } catch (error) {
            rej(error);
        }
    });
};
const getListPatientBooingMedicalService = (doctorId, date) => {
    return new Promise(async (res, rej) => {
        try {
            if (!doctorId || !date) {
                res({
                    errCode: 1,
                    message: 'Missing Parameter',
                });
            } else {
                const booking = await db.Booking.findAll({
                    where: { doctorId: doctorId, date: date, statusId: 'S2' },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: ['email', 'firstName', 'lastName', 'phonenumber', 'address', 'createdAt'],
                            include: [
                                {
                                    model: db.AllCodes,
                                    as: 'genderData',
                                    attributes: ['valueVI', 'valueEN'],
                                },
                            ],
                        },
                        {
                            model: db.AllCodes,
                            as: 'timeTypeDataBooking',
                            attributes: ['valueVI', 'valueEN'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                res({
                    errCode: 0,
                    message: 'OK!',
                    data: booking,
                });
            }
        } catch (error) {
            rej(error);
        }
    });
};
const completeConfirmMedicalService = (data) => {
    return new Promise(async (res, rej) => {
        try {
            const { email, namePatient, patientId, doctorId, token, timeType } = data;
            if (!email || !patientId || !namePatient || !doctorId || !token) {
                res({
                    errCode: 1,
                    message: 'Missing Parameter',
                });
            } else {
                const bookingData = await db.Booking.findOne({
                    where: {
                        patientId: patientId,
                        doctorId: doctorId,
                        statusId: 'S2',
                        token: token,
                        timeType: timeType,
                    },
                    raw: false,
                });
                if (bookingData) {
                    bookingData.set({
                        statusId: 'S3',
                    });
                    const baseUrlSend = buildUrlEmail(token, patientId, doctorId);
                    //
                    await Promise.all([
                        bookingData.save(),
                        sendEmailCofirmBill({
                            ...data,
                            baseUrlSend,
                        }),
                    ]);
                    //
                    res({
                        errCode: 0,
                        message: 'OK!',
                    });
                } else {
                    res({
                        errCode: 2,
                        message: 'Not Found Booking',
                    });
                }
            }
        } catch (error) {
            rej(error);
        }
    });
};
const getFeedbackDoctorService = (doctorId) => {
    return new Promise(async (res, rej) => {
        try {
            if (!doctorId) {
                res({
                    errCode: 1,
                    message: 'Missing Parameter',
                });
            } else {
                const feedbacks = await db.Evaluate.findAll({
                    where: {
                        doctorId: doctorId,
                    },
                    attributes: {
                        exclude: ['updatedAt', 'token', 'doctorId'],
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'patient',
                            attributes: ['firstName', 'lastName', 'address'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (feedbacks) {
                    res({
                        errCode: 0,
                        message: 'OK!',
                        feedbacks,
                    });
                } else {
                    res({
                        errCode: 2,
                        message: 'Not Found!',
                    });
                }
            }
        } catch (error) {
            rej(error);
        }
    });
};

///////// EXPORT ////
module.exports = {
    getTopDoctorHomeService,
    getAllDoctorService,
    postInfoDoctorService,
    getDetailInfoDoctorService,
    bulkCreateScheduleService,
    getScheduleDoctorByDateService,
    getListPatientBooingMedicalService,
    completeConfirmMedicalService,
    getFeedbackDoctorService,
};
