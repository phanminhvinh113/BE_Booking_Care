"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AllCodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      /// USER
      AllCodes.hasMany(models.User, {
        foreignKey: "positionId",
        as: "positionData",
      });
      AllCodes.hasMany(models.User, { foreignKey: "gender", as: "genderData" });
      // SCHEDULE
      AllCodes.hasMany(models.Schedule, {
        foreignKey: "timeType",
        as: "timeTypeData",
      });
      //DOCTOR INFO
      AllCodes.hasMany(models.DoctorInfo, {
        foreignKey: "specialtyId",
        as: "specs",
      });
      AllCodes.hasMany(models.DoctorInfo, {
        foreignKey: "provinceId",
        as: "province",
      });
      AllCodes.hasMany(models.DoctorInfo, {
        foreignKey: "priceId",
        as: "price",
      });
      AllCodes.hasMany(models.DoctorInfo, {
        foreignKey: "paymentId",
        as: "payment",
      });
      AllCodes.hasMany(models.Booking, {
        foreignKey: "timeType",
        as: "timeTypeDataBooking",
      });
      AllCodes.hasOne(models.Specialty, {
        foreignKey: "specialtyId",
        as: "specialtyValue",
      });
    }
  }
  AllCodes.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      valueEN: DataTypes.STRING,
      valueVI: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AllCodes",
    }
  );
  return AllCodes;
};
