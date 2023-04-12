'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Evaluate', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            patientId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            doctorId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            rate: {
                type: Sequelize.INTEGER,
            },
            comment: {
                type: Sequelize.TEXT,
            },
            countReplies: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            countLikes: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            parentId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            date: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            token: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Evaluate');
    },
};
