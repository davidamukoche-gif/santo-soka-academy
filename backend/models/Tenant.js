const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tenant = sequelize.define('Tenant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nationalId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  leaseStart: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  leaseEnd: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  deposit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  emergencyContact: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emergencyContactPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'moved_out', 'evicted'),
    defaultValue: 'active',
  },
});

module.exports = Tenant;
