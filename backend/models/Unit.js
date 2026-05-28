const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Unit = sequelize.define('Unit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  unitNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  floor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  block: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  unitType: {
    type: DataTypes.ENUM('bedsitter', '1bedroom', '2bedroom'),
    allowNull: false,
  },
  rentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('occupied', 'vacant'),
    defaultValue: 'vacant',
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  utilityMeterElectricity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  utilityMeterWater: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Unit;
