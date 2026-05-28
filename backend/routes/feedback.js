const express = require('express');
const { Feedback, Tenant, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { status, category } = req.query;
    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;

    if (req.user.role === 'tenant') {
      const tenant = await Tenant.findOne({ where: { userId: req.user.id } });
      if (!tenant) return res.status(404).json({ error: 'Tenant profile not found' });
      where.tenantId = tenant.id;
    }

    const feedbacks = await Feedback.findAll({
      where,
      include: [{
        model: Tenant,
        as: 'tenant',
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
      }],
      order: [['createdAt', 'DESC']],
    });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { category, message, rating } = req.body;

    let tenantId;
    if (req.user.role === 'tenant') {
      const tenant = await Tenant.findOne({ where: { userId: req.user.id } });
      if (!tenant) return res.status(404).json({ error: 'Tenant profile not found' });
      tenantId = tenant.id;
    } else {
      tenantId = req.body.tenantId;
    }

    const feedback = await Feedback.create({
      tenantId,
      category: category || 'general',
      message,
      rating,
    });

    const result = await Feedback.findByPk(feedback.id, {
      include: [{
        model: Tenant,
        as: 'tenant',
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
      }],
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.put('/:id', authenticate, authorize('admin', 'caretaker'), async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });

    const { status, adminReply } = req.body;
    if (status) feedback.status = status;
    if (adminReply !== undefined) feedback.adminReply = adminReply;

    await feedback.save();

    const result = await Feedback.findByPk(feedback.id, {
      include: [{
        model: Tenant,
        as: 'tenant',
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
      }],
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
