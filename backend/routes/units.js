const express = require('express');
const { Unit, Tenant, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'caretaker'), async (req, res) => {
  try {
    const { status, unitType, block, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (unitType) where.unitType = unitType;
    if (block) where.block = block;

    const units = await Unit.findAll({
      where,
      include: [{
        model: Tenant,
        as: 'tenant',
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
      }],
      order: [['unitNumber', 'ASC']],
    });

    let result = units;
    if (search) {
      const s = search.toLowerCase();
      result = units.filter(u =>
        u.unitNumber.toLowerCase().includes(s) ||
        u.tenant?.user?.name?.toLowerCase().includes(s)
      );
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/:id', authenticate, authorize('admin', 'caretaker'), async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id, {
      include: [{
        model: Tenant,
        as: 'tenant',
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
      }],
    });

    if (!unit) return res.status(404).json({ error: 'Unit not found' });
    res.json(unit);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { unitNumber, floor, block, unitType, rentAmount, utilityMeterElectricity, utilityMeterWater, notes } = req.body;

    const existing = await Unit.findOne({ where: { unitNumber } });
    if (existing) return res.status(400).json({ error: 'Unit number already exists' });

    const unit = await Unit.create({
      unitNumber, floor, block, unitType, rentAmount,
      utilityMeterElectricity, utilityMeterWater, notes,
    });

    res.status(201).json(unit);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (!unit) return res.status(404).json({ error: 'Unit not found' });

    const { unitNumber, floor, block, unitType, rentAmount, utilityMeterElectricity, utilityMeterWater, notes } = req.body;

    if (unitNumber !== undefined) unit.unitNumber = unitNumber;
    if (floor !== undefined) unit.floor = floor;
    if (block !== undefined) unit.block = block;
    if (unitType !== undefined) unit.unitType = unitType;
    if (rentAmount !== undefined) unit.rentAmount = rentAmount;
    if (utilityMeterElectricity !== undefined) unit.utilityMeterElectricity = utilityMeterElectricity;
    if (utilityMeterWater !== undefined) unit.utilityMeterWater = utilityMeterWater;
    if (notes !== undefined) unit.notes = notes;

    await unit.save();

    const result = await Unit.findByPk(unit.id, {
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
