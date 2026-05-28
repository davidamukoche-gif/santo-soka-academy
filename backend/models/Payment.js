const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('mpesa', 'bank', 'cash'),
    allowNull: false,
  },
  transactionCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  month: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('paid', 'partial', 'overdue', 'pending'),
    defaultValue: 'pending',
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Payment;
