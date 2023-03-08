import db from "../models";
import { Op } from "sequelize";
import moment from "moment";
import { convertToImageBase64 } from "../helper/convertImage";
import client from "../helper/redis_connection";
const getTopSpecialtyService = (limit, key) => {
  return new Promise(async (res, rej) => {
    try {
      const data = await db.Specialty.findAll({
        limit: +limit || 8,
        attributes: {
          exclude: ["createdAt", "updatedAt", "id"],
        },
      });
      if (data) {
        convertToImageBase64(data);
        await client.set(key, JSON.stringify(data), (err, reply) => {
          res({
            errCode: 0,
            message: "OK!",
            data,
            resid_store: err ? err : reply,
          });
        });
      } else {
        res({
          errCode: 1,
          message: "Failed!",
        });
      }
    } catch (error) {
      rej(error);
    }
  });
};
const getAllSpecialtyService = () => {
  return new Promise(async (res, rej) => {
    try {
      const data = await db.Specialty.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "id"],
        },
        include: [
          {
            model: db.AllCodes,
            as: "specialtyValue",
            attributes: ["valueEN", "valueVI"],
          },
        ],
        raw: false,
        nest: true,
      });
      if (data) {
        convertToImageBase64(data);
        res({
          errCode: 0,
          message: "Succed!",
          data,
        });
      } else {
        res({
          errCode: 1,
          message: "Failed!",
        });
      }
    } catch (error) {
      rej(error);
    }
  });
};
const postInfoSpecialtyService = (data) => {
  return new Promise(async (res, rej) => {
    try {
      const {
        description,
        contentHtml,
        contentMarkdown,
        specialtyId,
        image,
        name,
      } = data;
      if (!data || !contentMarkdown || !specialtyId) {
        res({
          errCode: 1,
          message: "Missing Parameter",
        });
      } else {
        const [specialty, created] = await db.Specialty.findOrCreate({
          where: { specialtyId: specialtyId },
          defaults: {
            specialtyId,
            description,
            contentHTML: contentHtml,
            contentMarkdown,
            image,
            name: name.lable,
          },
          raw: false,
        });

        if (specialty && !created) {
          if (image) {
            specialty.set({
              specialtyId: specialtyId,
              description: description,
              contentHTML: contentHtml,
              contentMarkdown: contentMarkdown,
              image: image,
              name: name,
            });
          } else {
            specialty.set({
              specialtyId: specialtyId,
              description: description,
              contentHTML: contentHtml,
              contentMarkdown: contentMarkdown,
              name: name,
            });
          }

          await specialty.save();
          res({
            errCode: 0,
            message: "Save Succed!",
          });
        } else if (created) {
          res({
            errCode: 0,
            message: "Create Succed!",
          });
        }
      }
    } catch (error) {
      rej(error);
    }
  });
};
const getSpecialtyByIdService = (id) => {
  return new Promise(async (res, rej) => {
    try {
      if (!id) {
        res({
          errCode: 1,
          message: "Missing Parameter",
        });
      } else {
        let data = await db.Specialty.findOne({
          where: { specialtyId: id },
        });
        if (!data) {
          data = null;
        }
        res({
          errCode: 0,
          message: "OK!",
          data,
        });
      }
    } catch (error) {
      rej(error);
    }
  });
};
const getInfoDoctorBelongSpecialtyService = (type, provinceId) => {
  return new Promise(async (res, rej) => {
    try {
      if (!type || !provinceId) {
        res({
          errCode: 1,
          message: "Missing Parameter",
        });
      } else {
        if (provinceId === "ALL") {
          //FIND DOCTORS
          const data = await db.DoctorInfo.findAll({
            where: { specialtyId: type },
            attributes: ["doctorId"],
            include: [
              {
                model: db.User,
                attributes: ["firstName", "lastName", "address", "image"],
                include: [
                  {
                    model: db.Markdown,
                    attributes: ["description", "specialtyId", "clinicId"],
                  },
                  {
                    model: db.DoctorInfo,
                    attributes: ["name", "nameClinic", "addressClinic"],
                    include: [
                      {
                        model: db.AllCodes,
                        as: "province",
                        attributes: ["valueEN", "valueVI"],
                      },
                      {
                        model: db.AllCodes,
                        as: "price",
                        attributes: ["valueEN", "valueVI"],
                      },
                      {
                        model: db.AllCodes,
                        as: "payment",
                        attributes: ["valueEN", "valueVI"],
                      },
                      {
                        model: db.AllCodes,
                        as: "specs",
                        attributes: ["valueEN", "valueVI"],
                      },
                    ],
                  },
                  {
                    model: db.AllCodes,
                    as: "positionData",
                    attributes: ["valueEN", "valueVI"],
                  },
                ],
              },
            ],
            nest: true,
            raw: false,
          });
          convertToImageBase64(data);
          //FIND SCHEDULE DOCTORS
          let scheduleDoctor = [];
          if (data) {
            for (let doctor of data) {
              const minDate = moment(new Date())
                .subtract(1, "days")
                .startOf("days")
                .valueOf();
              const maxDay = moment(new Date())
                .add(7, "days")
                .startOf("days")
                .valueOf();
              const schedule = await db.Schedule.findAll({
                where: {
                  doctorId: doctor.doctorId,
                  date: {
                    [Op.between]: [minDate, maxDay],
                  },
                },
                attributes: ["date", "timeType"],
                include: [
                  {
                    model: db.AllCodes,
                    as: "timeTypeData",
                    attributes: ["valueEN", "valueVI"],
                  },
                ],
                raw: false,
                nest: true,
              });
              scheduleDoctor = [
                ...scheduleDoctor,
                { doctorId: doctor.doctorId, schedule },
              ];
            }
          }
          //
          res({
            errCode: 0,
            message: "OK!",
            data,
            scheduleDoctor,
          });
        } else {
          const data = await db.DoctorInfo.findAll({
            where: { specialtyId: type, provinceId: provinceId },
            attributes: ["doctorId"],
            include: [
              {
                model: db.User,
                attributes: ["firstName", "lastName", "address", "image"],
                include: [
                  {
                    model: db.Markdown,
                    attributes: ["description", "specialtyId", "clinicId"],
                  },
                  {
                    model: db.DoctorInfo,
                    attributes: ["name", "nameClinic", "addressClinic"],
                    include: [
                      {
                        model: db.AllCodes,
                        as: "province",
                        attributes: ["valueEN", "valueVI"],
                      },
                      {
                        model: db.AllCodes,
                        as: "price",
                        attributes: ["valueEN", "valueVI"],
                      },
                      {
                        model: db.AllCodes,
                        as: "payment",
                        attributes: ["valueEN", "valueVI"],
                      },
                      {
                        model: db.AllCodes,
                        as: "specs",
                        attributes: ["valueEN", "valueVI"],
                      },
                    ],
                  },
                  {
                    model: db.AllCodes,
                    as: "positionData",
                    attributes: ["valueEN", "valueVI"],
                  },
                ],
              },
            ],
            nest: true,
            raw: false,
          });
          let scheduleDoctor = [];
          if (data) {
            for (let doctor of data) {
              const minDate = moment(new Date())
                .subtract(1, "days")
                .startOf("days")
                .valueOf();
              const maxDay = moment(new Date())
                .add(7, "days")
                .startOf("days")
                .valueOf();
              const schedule = await db.Schedule.findAll({
                where: {
                  doctorId: doctor.doctorId,
                  date: {
                    [Op.between]: [minDate, maxDay],
                  },
                },
                attributes: ["date", "timeType"],
                include: [
                  {
                    model: db.AllCodes,
                    as: "timeTypeData",
                    attributes: ["valueEN", "valueVI"],
                  },
                ],
                raw: false,
                nest: true,
              });
              scheduleDoctor = [
                ...scheduleDoctor,
                { doctorId: doctor.doctorId, schedule },
              ];
            }
          }
          res({
            errCode: 0,
            message: "OK!",
            data,
            scheduleDoctor,
          });
        }
      }
    } catch (error) {
      rej(error);
    }
  });
};
module.exports = {
  getTopSpecialtyService,
  getAllSpecialtyService,
  postInfoSpecialtyService,
  getSpecialtyByIdService,
  getInfoDoctorBelongSpecialtyService,
};
