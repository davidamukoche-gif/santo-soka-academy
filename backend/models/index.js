const sequelize = require('../config/database');
const User = require('./User');
const Unit = require('./Unit');
const Tenant = require('./Tenant');
const Payment = require('./Payment');
const MaintenanceRequest = require('./MaintenanceRequest');
const Feedback = require('./Feedback');

User.hasOne(Tenant, { foreignKey: 'userId', as: 'tenantProfile' });
Tenant.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Tenant.hasOne(Unit, { foreignKey: 'tenantId', as: 'unit' });
Unit.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

Tenant.hasMany(Payment, { foreignKey: 'tenantId', as: 'payments' });
Payment.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

Payment.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });

Tenant.hasMany(MaintenanceRequest, { foreignKey: 'tenantId', as: 'maintenanceRequests' });
MaintenanceRequest.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
MaintenanceRequest.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });

Tenant.hasMany(Feedback, { foreignKey: 'tenantId', as: 'feedbacks' });
Feedback.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

module.exports = {
  sequelize,
  User,
  Unit,
  Tenant,
  Payment,
  MaintenanceRequest,
  Feedback,
};
