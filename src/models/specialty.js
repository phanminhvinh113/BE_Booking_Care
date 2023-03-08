"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Specialty.hasMany(models.DoctorInfo, {
        foreignKey: "doctorId",
      });
      Specialty.belongsTo(models.AllCodes, {
        foreignKey: "specialtyId",
        targetKey: "keyMap",
        as: "specialtyValue",
      });
      // define association here
    }
  }
  Specialty.init(
    {
      description: DataTypes.TEXT,
      contentHTML: DataTypes.TEXT,
      contentMarkdown: DataTypes.TEXT,
      image: DataTypes.BLOB,
      name: DataTypes.STRING,
      specialtyId: DataTypes.STRING,
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: "Specialty",
    }
  );
  return Specialty;
};
