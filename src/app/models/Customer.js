import Sequelize, { Model } from "sequelize";

class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        status: {
          type: Sequelize.ENUM("ACTIVE", "ARCHIVED"),
          defaultValue: "ACTIVE"
        },
      },
      {
        sequelize,
        tableName: "customers",
        underscored: true,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Contact, {
      foreignKey: "customer_id",
      as: "contacts",
      onDelete: "CASCADE",
    });
  }
}

export default Customer;