const express = require('express');
const { User, Tenant, Unit, Payment } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'caretaker'), async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};
    if (status) where.status = status;

    const tenants = await Tenant.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Unit, as: 'unit', attributes: ['id', 'unitNumber', 'unitType', 'rentAmount'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    let result = tenants;
    if (search) {
      const s = search.toLowerCase();
      result = tenants.filter(t =>
        t.user?.name?.toLowerCase().includes(s) ||
        t.user?.email?.toLowerCase().includes(s) ||
        t.nationalId?.toLowerCase().includes(s) ||
        t.unit?.unitNumber?.toLowerCase().includes(s)
      );
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Unit, as: 'unit' },
        { model: Payment, as: 'payments', order: [['paymentDate', 'DESC']] },
      ],
    });

    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    if (req.user.role === 'tenant') {
      const userTenant = await Tenant.findOne({ where: { userId: req.user.id } });
      if (!userTenant || userTenant.id !== tenant.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(tenant);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/', authenticate, authorize('admin', 'caretaker'), async (req, res) => {
  try {
    const { name, email, phone, password, nationalId, leaseStart, leaseEnd, deposit, emergencyContact, emergencyContactPhone, unitId } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password: password || 'tenant123',
      role: 'tenant',
    });

    const tenant = await Tenant.create({
      userId: user.id,
      nationalId,
      leaseStart,
      leaseEnd,
      deposit,
      emergencyContact,
      emergencyContactPhone,
    });

    if (unitId) {
      const unit = await Unit.findByPk(unitId);
      if (unit && unit.status === 'vacant') {
        unit.tenantId = tenant.id;
        unit.status = 'occupied';
        await unit.save();
      }
    }

    const result = await Tenant.findByPk(tenant.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
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
    const tenant = await Tenant.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }],
    });

    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    const { name, email, phone, nationalId, leaseStart, leaseEnd, deposit, emergencyContact, emergencyContactPhone, status, unitId } = req.body;

    if (name || email || phone) {
      if (name) tenant.user.name = name;
      if (email) tenant.user.email = email;
      if (phone) tenant.user.phone = phone;
      await tenant.user.save();
    }

    if (nationalId !== undefined) tenant.nationalId = nationalId;
    if (leaseStart !== undefined) tenant.leaseStart = leaseStart;
    if (leaseEnd !== undefined) tenant.leaseEnd = leaseEnd;
    if (deposit !== undefined) tenant.deposit = deposit;
    if (emergencyContact !== undefined) tenant.emergencyContact = emergencyContact;
    if (emergencyContactPhone !== undefined) tenant.emergencyContactPhone = emergencyContactPhone;
    if (status !== undefined) tenant.status = status;
    await tenant.save();

    if (unitId !== undefined) {
      const currentUnit = await Unit.findOne({ where: { tenantId: tenant.id } });
      if (currentUnit && currentUnit.id !== unitId) {
        currentUnit.tenantId = null;
        currentUnit.status = 'vacant';
        await currentUnit.save();
      }

      if (unitId) {
        const newUnit = await Unit.findByPk(unitId);
        if (newUnit) {
          newUnit.tenantId = tenant.id;
          newUnit.status = 'occupied';
          await newUnit.save();
        }
      }
    }

    if (status === 'moved_out' || status === 'evicted') {
      const unit = await Unit.findOne({ where: { tenantId: tenant.id } });
      if (unit) {
        unit.tenantId = null;
        unit.status = 'vacant';
        await unit.save();
      }
    }

    const result = await Tenant.findByPk(tenant.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Unit, as: 'unit' },
      ],
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    const unit = await Unit.findOne({ where: { tenantId: tenant.id } });
    if (unit) {
      unit.tenantId = null;
      unit.status = 'vacant';
      await unit.save();
    }

    const user = await User.findByPk(tenant.userId);
    if (user) {
      user.isActive = false;
      await user.save();
    }

    tenant.status = 'moved_out';
    await tenant.save();

    res.json({ message: 'Tenant removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
