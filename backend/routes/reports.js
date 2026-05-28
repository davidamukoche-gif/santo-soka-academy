const express = require('express');
const { Op } = require('sequelize');
const { Unit, Tenant, Payment, MaintenanceRequest, Feedback, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/income', authenticate, authorize('admin', 'caretaker'), async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = parseInt(year) || new Date().getFullYear();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const monthlyData = [];
    for (const month of months) {
      const payments = await Payment.findAll({
        where: { month, year: targetYear },
      });
      const total = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      monthlyData.push({ month, total, count: payments.length });
    }

    const yearTotal = monthlyData.reduce((sum, m) => sum + m.total, 0);

    res.json({ year: targetYear, monthlyData, yearTotal });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/outstanding', authenticate, authorize('admin', 'caretaker'), async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();

    const occupiedUnits = await Unit.findAll({
      where: { status: 'occupied' },
      include: [{
        model: Tenant,
        as: 'tenant',
        where: { status: 'active' },
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
      }],
    });

    const outstanding = [];

    for (const unit of occupiedUnits) {
      const payments = await Payment.findAll({
        where: { tenantId: unit.tenantId, month: currentMonth, year: currentYear },
      });

      const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const rentAmount = parseFloat(unit.rentAmount);
      const balance = rentAmount - totalPaid;

      if (balance > 0) {
        outstanding.push({
          tenant: unit.tenant?.user?.name,
          email: unit.tenant?.user?.email,
          phone: unit.tenant?.user?.phone,
          unit: unit.unitNumber,
          rentAmount,
          totalPaid,
          balance,
          status: totalPaid === 0 ? 'unpaid' : 'partial',
        });
      }
    }

    const totalOutstanding = outstanding.reduce((sum, o) => sum + o.balance, 0);

    res.json({ month: currentMonth, year: currentYear, outstanding, totalOutstanding });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/vacant-units', authenticate, authorize('admin', 'caretaker'), async (req, res) => {
  try {
    const vacantUnits = await Unit.findAll({
      where: { status: 'vacant' },
      order: [['unitNumber', 'ASC']],
    });

    const summary = {
      total: vacantUnits.length,
      byType: {
        bedsitter: vacantUnits.filter(u => u.unitType === 'bedsitter').length,
        '1bedroom': vacantUnits.filter(u => u.unitType === '1bedroom').length,
        '2bedroom': vacantUnits.filter(u => u.unitType === '2bedroom').length,
      },
    };

    res.json({ vacantUnits, summary });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/maintenance', authenticate, authorize('admin', 'caretaker'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    const requests = await MaintenanceRequest.findAll({ where });

    const byStatus = {
      open: requests.filter(r => r.status === 'open').length,
      in_progress: requests.filter(r => r.status === 'in_progress').length,
      completed: requests.filter(r => r.status === 'completed').length,
    };

    const byCategory = {};
    requests.forEach(r => {
      byCategory[r.category] = (byCategory[r.category] || 0) + 1;
    });

    const byPriority = {
      high: requests.filter(r => r.priority === 'high').length,
      medium: requests.filter(r => r.priority === 'medium').length,
      low: requests.filter(r => r.priority === 'low').length,
    };

    res.json({ total: requests.length, byStatus, byCategory, byPriority });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/feedback-stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll();

    const byCategory = {};
    feedbacks.forEach(f => {
      byCategory[f.category] = (byCategory[f.category] || 0) + 1;
    });

    const byStatus = {
      pending: feedbacks.filter(f => f.status === 'pending').length,
      reviewed: feedbacks.filter(f => f.status === 'reviewed').length,
      resolved: feedbacks.filter(f => f.status === 'resolved').length,
    };

    const ratings = feedbacks.filter(f => f.rating).map(f => f.rating);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;

    res.json({ total: feedbacks.length, byCategory, byStatus, avgRating });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
