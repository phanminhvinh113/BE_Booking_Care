"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DoctorInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //
      DoctorInfo.belongsTo(models.User, {
        foreignKey: "doctorId",
      });
      DoctorInfo.belongsTo(models.AllCodes, {
        foreignKey: "specialtyId",
        targetKey: "keyMap",
        as: "specs",
      });
      DoctorInfo.belongsTo(models.AllCodes, {
        foreignKey: "provinceId",
        targetKey: "keyMap",
        as: "province",
      });
      DoctorInfo.belongsTo(models.AllCodes, {
        foreignKey: "priceId",
        targetKey: "keyMap",
        as: "price",
      });
      DoctorInfo.belongsTo(models.AllCodes, {
        foreignKey: "paymentId",
        targetKey: "keyMap",
        as: "payment",
      });
      DoctorInfo.belongsTo(models.Schedule, {
        foreignKey: "doctorId",
        targetKey: "doctorId",
        as: "scheduleDoctor",
      });
    }
  }
  DoctorInfo.init(
    {
      doctorId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      specialtyId: DataTypes.STRING,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      note: DataTypes.STRING,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: "DoctorInfo",
    }
  );
  return DoctorInfo;
};
