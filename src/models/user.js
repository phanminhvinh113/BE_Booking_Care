'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class User extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         // define association here
         User.hasOne(models.Markdown, { foreignKey: 'doctorId' });
         User.hasOne(models.DoctorInfo, { foreignKey: 'doctorId' });
         User.hasOne(models.Evaluate, { foreignKey: 'patientId', as: 'patient' });
         User.hasOne(models.Conversation, { foreignKey: 'senderId' });
         //

         //
         User.belongsTo(models.AllCodes, {
            foreignKey: 'positionId',
            targetKey: 'keyMap',
            as: 'positionData',
         });
         User.belongsTo(models.AllCodes, {
            foreignKey: 'gender',
            targetKey: 'keyMap',
            as: 'genderData',
         });
         User.hasMany(models.Booking, {
            foreignKey: 'patientId',
            as: 'patientData',
         });
      }
   }
   User.init(
      {
         email: DataTypes.STRING,
         password: DataTypes.STRING,
         firstName: DataTypes.STRING,
         lastName: DataTypes.STRING,
         address: DataTypes.STRING,
         phonenumber: DataTypes.STRING,
         gender: DataTypes.STRING,
         image: DataTypes.STRING,
         typeRole: DataTypes.STRING,
         keyRole: DataTypes.STRING,
         roleId: DataTypes.STRING,
         positionId: DataTypes.STRING,
         deletedAt: DataTypes.DATE,
      },
      {
         sequelize,
         paranoid: true,
         // If you want to give a custom name to the deletedAt column
         freezeTableName: true,
         modelName: 'User',
         tableName: 'User',
      },
   );
   return User;
};
