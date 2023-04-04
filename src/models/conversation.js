'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class Conversation extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         // define association here
         Conversation.belongsTo(models.User, {
            foreignKey: 'senderId',
         });
      }
   }
   Conversation.init(
      {
         senderId: DataTypes.INTEGER,
         receiverId: DataTypes.INTEGER,
         messageWait: DataTypes.INTEGER,
         typeSenderId: DataTypes.STRING,
         typeReceiverId: DataTypes.STRING,
      },
      {
         sequelize,
         freezeTableName: true,
         modelName: 'Conversation',
      },
   );
   return Conversation;
};
