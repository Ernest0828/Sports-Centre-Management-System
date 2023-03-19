const Sequelize = require("sequelize");
const db = require("../db");

const { STRING, UUID, UUIDV4, INTEGER, BOOLEAN } = Sequelize;

const Customer = db.define('Customer', {
  customerId: {
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  customerName: {
    type: STRING,
    allowNull: false
  },
  customerNumber: {
    type: INTEGER,
    allowNull: false
  },
  customerEmail: {
    type: STRING,
    allowNull: false
  },
  password: {
    type: STRING,
    allowNull: false
  },
  isMembership: {
    type: BOOLEAN,
    allowNull: true
  },
  bookings: {
    type: STRING,
    allowNull: true
  }
});

module.exports = Customer;