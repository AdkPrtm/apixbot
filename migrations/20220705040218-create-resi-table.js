'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_resi', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      resi: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status_cod: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pembayaran_cod: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fee_cod: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      lokasi: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      diterima: {
        type: Sequelize.STRING,
        defaultValue: 'Belum'
      },
      fee: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_resi');
  }
};
