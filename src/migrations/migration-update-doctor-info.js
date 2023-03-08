module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("DoctorInfo", "specialtyId", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("DoctorInfo", "specialtyId", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
};
