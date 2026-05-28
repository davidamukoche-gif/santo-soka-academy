const express = require('express');
const { MaintenanceRequest, Tenant, Unit, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { status, priority, category } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;

    if (req.user.role === 'tenant') {
      const tenant = await Tenant.findOne({ where: { userId: req.user.id } });
      if (!tenant) return res.status(404).json({ error: 'Tenant profile not found' });
      where.tenantId = tenant.id;
    }

    const requests = await MaintenanceRequest.findAll({
      where,
      include: [
        {
          model: Tenant,
          as: 'tenant',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
        },
        { model: Unit, as: 'unit', attributes: ['id', 'unitNumber'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByPk(req.params.id, {
      include: [
        {
          model: Tenant,
          as: 'tenant',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
        },
        { model: Unit, as: 'unit' },
      ],
    });

    if (!request) return res.status(404).json({ error: 'Request not found' });

    if (req.user.role === 'tenant') {
      const tenant = await Tenant.findOne({ where: { userId: req.user.id } });
      if (!tenant || tenant.id !== request.tenantId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    let tenantId;
    let unitId;

    if (req.user.role === 'tenant') {
      const tenant = await Tenant.findOne({
        where: { userId: req.user.id },
        include: [{ model: Unit, as: 'unit' }],
      });
      if (!tenant) return res.status(404).json({ error: 'Tenant profile not found' });
      tenantId = tenant.id;
      unitId = tenant.unit?.id;
    } else {
      tenantId = req.body.tenantId;
      unitId = req.body.unitId;
    }

    const request = await MaintenanceRequest.create({
      tenantId,
      unitId,
      title,
      description,
      category: category || 'other',
      priority: priority || 'medium',
    });

    const result = await MaintenanceRequest.findByPk(request.id, {
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

router.put('/:id', authenticate, authorize('admin', 'caretaker'), async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const { status, priority, adminNotes } = req.body;
    if (status) request.status = status;
    if (priority) request.priority = priority;
    if (adminNotes !== undefined) request.adminNotes = adminNotes;

    await request.save();

    const result = await MaintenanceRequest.findByPk(request.id, {
      include: [
        {
          model: Tenant,
          as: 'tenant',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
        },
        { model: Unit, as: 'unit' },
      ],
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
