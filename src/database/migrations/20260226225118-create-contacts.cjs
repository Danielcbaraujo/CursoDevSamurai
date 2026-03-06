'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('contacts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },

      status: {
        type: Sequelize.ENUM('ACTIVE', 'ARCHIVED'),
        allowNull: false,
        defaultValue: 'ACTIVE'
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },

      customer_id: {
        type: Sequelize.INTEGER,
        references: {model: "customers", key: "id"},
        onUpdate:"CASCADE",
        onDelete: "CASCADE",
        allowNull: false,

      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('contacts');
  }
};