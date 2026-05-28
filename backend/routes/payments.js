const express = require('express');
const { Op } = require('sequelize');
const { Payment, Tenant, Unit, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { status, month, year, tenantId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (month) where.month = month;
    if (year) where.year = parseInt(year);
    if (tenantId) where.tenantId = parseInt(tenantId);

    if (req.user.role === 'tenant') {
      const tenant = await Tenant.findOne({ where: { userId: req.user.id } });
      if (!tenant) return res.status(404).json({ error: 'Tenant profile not found' });
      where.tenantId = tenant.id;
    }

    const payments = await Payment.findAll({
      where,
      include: [
        {
          model: Tenant,
          as: 'tenant',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
        },
        { model: Unit, as: 'unit', attributes: ['id', 'unitNumber'] },
      ],
      order: [['paymentDate', 'DESC']],
    });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        {
          model: Tenant,
          as: 'tenant',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
        },
        { model: Unit, as: 'unit' },
      ],
    });

    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (req.user.role === 'tenant') {
      const tenant = await Tenant.findOne({ where: { userId: req.user.id } });
      if (!tenant || tenant.id !== payment.tenantId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/', authenticate, authorize('admin', 'caretaker'), async (req, res) => {
  try {
    const { tenantId, amount, paymentMethod, transactionCode, paymentDate, month, year, notes } = req.body;

    const tenant = await Tenant.findByPk(tenantId, {
      include: [{ model: Unit, as: 'unit' }],
    });

    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    const rentAmount = tenant.unit ? parseFloat(tenant.unit.rentAmount) : 0;
    const paidAmount = parseFloat(amount);

    const existingPayments = await Payment.findAll({
      where: { tenantId, month, year: parseInt(year) },
    });

    const totalPaid = existingPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0) + paidAmount;
    const balance = Math.max(0, rentAmount - totalPaid);
    let paymentStatus = 'paid';
    if (balance > 0) paymentStatus = 'partial';

    const payment = await Payment.create({
      tenantId,
      unitId: tenant.unit?.id,
      amount: paidAmount,
      paymentMethod,
      transactionCode,
      paymentDate,
      month,
      year: parseInt(year),
      status: paymentStatus,
      balance,
      notes,
    });

    if (existingPayments.length > 0) {
      for (const ep of existingPayments) {
        ep.balance = balance;
        if (balance === 0) ep.status = 'paid';
        else ep.status = 'partial';
        await ep.save();
      }
    }

    const result = await Payment.findByPk(payment.id, {
      include: [
        {
          model: Tenant,
          as: 'tenant',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
        },
        { model: Unit, as: 'unit' },
      ],
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    const { amount, paymentMethod, transactionCode, paymentDate, status, notes } = req.body;

    if (amount !== undefined) payment.amount = amount;
    if (paymentMethod !== undefined) payment.paymentMethod = paymentMethod;
    if (transactionCode !== undefined) payment.transactionCode = transactionCode;
    if (paymentDate !== undefined) payment.paymentDate = paymentDate;
    if (status !== undefined) payment.status = status;
    if (notes !== undefined) payment.notes = notes;

    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/receipt/:id', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        {
          model: Tenant,
          as: 'tenant',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
        },
        { model: Unit, as: 'unit' },
      ],
    });

    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (req.user.role === 'tenant') {
      const tenant = await Tenant.findOne({ where: { userId: req.user.id } });
      if (!tenant || tenant.id !== payment.tenantId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const receipt = {
      receiptNumber: `RCP-${String(payment.id).padStart(6, '0')}`,
      date: payment.paymentDate,
      tenant: payment.tenant?.user?.name,
      unit: payment.unit?.unitNumber,
      amount: payment.amount,
      method: payment.paymentMethod,
      transactionCode: payment.transactionCode,
      month: payment.month,
      year: payment.year,
      balance: payment.balance,
      status: payment.status,
    };

    res.json(receipt);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
