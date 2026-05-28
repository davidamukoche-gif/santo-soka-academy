const express = require('express');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { Unit, Tenant, Payment, MaintenanceRequest, Feedback, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'caretaker'), async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();

    const totalUnits = await Unit.count();
    const occupiedUnits = await Unit.count({ where: { status: 'occupied' } });
    const vacantUnits = await Unit.count({ where: { status: 'vacant' } });
    const totalTenants = await Tenant.count({ where: { status: 'active' } });

    const monthPayments = await Payment.findAll({
      where: { month: currentMonth, year: currentYear },
    });

    const monthlyRevenue = monthPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const allOccupiedUnits = await Unit.findAll({
      where: { status: 'occupied' },
      include: [{ model: Tenant, as: 'tenant' }],
    });

    const expectedRevenue = allOccupiedUnits.reduce((sum, u) => sum + parseFloat(u.rentAmount), 0);
    const pendingPayments = expectedRevenue - monthlyRevenue;

    const paidTenantIds = new Set(monthPayments.filter(p => p.status === 'paid').map(p => p.tenantId));
    const partialTenantIds = new Set(monthPayments.filter(p => p.status === 'partial').map(p => p.tenantId));
    const allActiveTenantIds = allOccupiedUnits.map(u => u.tenantId).filter(Boolean);
    const overdueTenants = allActiveTenantIds.filter(id => !paidTenantIds.has(id) && !partialTenantIds.has(id)).length;

    const openMaintenance = await MaintenanceRequest.count({ where: { status: 'open' } });
    const inProgressMaintenance = await MaintenanceRequest.count({ where: { status: 'in_progress' } });
    const pendingFeedback = await Feedback.count({ where: { status: 'pending' } });

    const recentPayments = await Payment.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Tenant,
          as: 'tenant',
          include: [{ model: User, as: 'user', attributes: ['name'] }],
        },
        { model: Unit, as: 'unit', attributes: ['unitNumber'] },
      ],
    });

    const recentMaintenance = await MaintenanceRequest.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Tenant,
          as: 'tenant',
          include: [{ model: User, as: 'user', attributes: ['name'] }],
        },
        { model: Unit, as: 'unit', attributes: ['unitNumber'] },
      ],
    });

    const recentFeedback = await Feedback.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{
        model: Tenant,
        as: 'tenant',
        include: [{ model: User, as: 'user', attributes: ['name'] }],
      }],
    });

    const upcomingLeaseExpiries = await Tenant.findAll({
      where: {
        status: 'active',
        leaseEnd: {
          [Op.between]: [now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)],
        },
      },
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'phone'] },
        { model: Unit, as: 'unit', attributes: ['unitNumber'] },
      ],
      limit: 10,
    });

    res.json({
      stats: {
        totalUnits,
        occupiedUnits,
        vacantUnits,
        totalTenants,
        monthlyRevenue,
        expectedRevenue,
        pendingPayments: Math.max(0, pendingPayments),
        overdueTenants,
        openMaintenance,
        inProgressMaintenance,
        pendingFeedback,
      },
      recentPayments,
      recentMaintenance,
      recentFeedback,
      upcomingLeaseExpiries,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
