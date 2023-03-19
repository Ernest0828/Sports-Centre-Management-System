const Sequelize = require("sequelize");
const db = require("../db");
const Customer = require("./customer");
const Staff = require("./staff");
const Activity = require("./activity");
const Facility = require("./facility");
const Payment = require("./payment");
const Classes = require("./classes");

const { INTEGER, DATE, TIME, ENUM } = Sequelize;

const Booking = db.define('Booking', {
    bookingId: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    noOfPeople: {
        type: INTEGER,
        allowNull: false
    },
    date: {
        type: DATE,
        allowNull: false
    },
    startTime: {
        type: TIME,
        allowNull: false
    },
    endTime: {
        type: TIME,
        allowNull: false
    },
    bookingType: {
        type: ENUM('activity', 'class'),
        allowNull: false
  },
});

// add foreign key constraint
Booking.belongsTo(Customer, { foreignKey: 'customerId' });
Booking.belongsTo(Staff, { foreignKey: 'staffId', allowNull: true });
Booking.belongsTo(Activity, { foreignKey: 'activityId', allowNull: true });
Booking.belongsTo(Classes, { foreignKey: 'classId', allowNull: true });
Booking.belongsTo(Facility, { foreignKey: 'facilityName' });
Booking.belongsTo(Payment, { foreignKey: 'paymentId' });

module.exports = Booking;