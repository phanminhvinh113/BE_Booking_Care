'use strict';
const { model } = require('mongoose');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Evaluate extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Evaluate.belongsTo(models.User, {
                foreignKey: 'patientId',
                as: 'patient',
            });
        }
    }
    Evaluate.init(
        {
            patientId: DataTypes.INTEGER,
            doctorId: DataTypes.INTEGER,
            rate: DataTypes.INTEGER,
            comment: DataTypes.TEXT,
            countReplies: DataTypes.INTEGER,
            countLikes: DataTypes.INTEGER,
            parentId: DataTypes.INTEGER,
            date: DataTypes.STRING,
            token: DataTypes.STRING,
        },
        {
            sequelize,
            freezeTableName: true,
            modelName: 'Evaluate',
        },
    );
    return Evaluate;
};
