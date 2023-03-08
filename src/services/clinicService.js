import db from "../models";
import { convertToImageBase64 } from "../helper/convertImage";
const postInfoClinicService = (data) => {
  return new Promise(async (res, rej) => {
    try {
      const {
        name,
        address,
        image,
        contentMarkdown,
        contentHtml,
        description,
      } = data;
      if (!name || !address | !contentMarkdown) {
        res({
          errCode: 1,
          message: "Missing Parameter",
        });
      } else {
        const [clinic, created] = await db.Clinic.findOrCreate({
          where: { name: name },
          defaults: {
            name,
            address,
            image,
            description,
            contentHtml,
            contentMarkdown,
          },
          raw: false,
        });
        if (!created) {
          clinic.set({
            ...data,
          });
          await clinic.save();
          res({
            errCode: 0,
            message: "Save Succed!",
          });
        } else {
          res({
            errCode: 0,
            message: "Post Succed!",
          });
        }
      }
    } catch (error) {
      rej(error);
    }
  });
};
const getTopClinicHomeService = (limit) => {
  return new Promise(async (res, rej) => {
    try {
      const data = await db.Clinic.findAll({
        limit: +limit || 8,
        attributes: {
          excludes: ["updateAt", "createdAt", "id", "contentMarkdown"],
        },
      });
      if (!!data.length) {
        convertToImageBase64(data);
        res({
          errCode: 0,
          message: "OK!",
          data,
        });
      } else {
        res({
          errCode: 0,
          message: "Not Found Any Clinic",
        });
      }
    } catch (error) {
      rej(error);
    }
  });
};
const getAllClinicService = () => {
  return new Promise(async (res, rej) => {
    try {
      const data = await db.Clinic.findAll({
        attributes: {
          excludes: ["updateAt", "createdAt"],
        },
      });
      if (!!data.length) {
        convertToImageBase64(data);
        res({
          errCode: 0,
          message: "OK!",
          data,
        });
      } else {
        res({
          errCode: 0,
          message: "Not Found Any Clinic",
        });
      }
    } catch (error) {
      rej(error);
    }
  });
};
module.exports = {
  postInfoClinicService,
  getTopClinicHomeService,
  getAllClinicService,
};
