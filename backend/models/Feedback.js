const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('security', 'cleanliness', 'water', 'noise', 'staff_behavior', 'general'),
    allowNull: false,
    defaultValue: 'general',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { min: 1, max: 5 },
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'resolved'),
    defaultValue: 'pending',
  },
  adminReply: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Feedback;
