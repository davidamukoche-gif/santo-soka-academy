const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaintenanceRequest = sequelize.define('MaintenanceRequest', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM('plumbing', 'electricity', 'broken_door_window', 'noise', 'water', 'internet', 'other'),
    allowNull: false,
    defaultValue: 'other',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'completed'),
    defaultValue: 'open',
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = MaintenanceRequest;
