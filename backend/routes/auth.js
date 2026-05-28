const express = require('express');
const jwt = require('jsonwebtoken');
const { User, Tenant } = require('../models');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    let tenantId = null;
    if (user.role === 'tenant') {
      const tenant = await Tenant.findOne({ where: { userId: user.id } });
      if (tenant) tenantId = tenant.id;
    }

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        tenantId,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    let tenantId = null;
    if (req.user.role === 'tenant') {
      const tenant = await Tenant.findOne({ where: { userId: req.user.id } });
      if (tenant) tenantId = tenant.id;
    }

    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      tenantId,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (newPassword) {
      if (!currentPassword || !(await user.validatePassword(currentPassword))) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      user.password = newPassword;
    }

    await user.save();
    res.json({ message: 'Profile updated', user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
