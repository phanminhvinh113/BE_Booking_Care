"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Clinic.init(
    {
      address: DataTypes.STRING,
      description: DataTypes.TEXT,
      image: DataTypes.BLOB,
      name: DataTypes.STRING,
      contentMarkdown: DataTypes.TEXT,
      contentHtml: DataTypes.TEXT,
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: "Clinic",
    }
  );
  return Clinic;
};
