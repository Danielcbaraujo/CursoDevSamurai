import Sequelize, { Model } from "sequelize";

class Contact extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isEmail: true,
          },
        },
        status: {
          type: Sequelize.ENUM("ACTIVE", "INACTIVE", "ARCHIVED"),
          defaultValue: "ACTIVE",
        },
      },
      {
        sequelize,
        tableName: "contacts",
        underscored: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Customer, {
      foreignKey: "customer_id",
      as: "customer",
      onDelete: "CASCADE",
    });
  }
}

export default Contact;