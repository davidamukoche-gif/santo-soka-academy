require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const authRoutes = require('./routes/auth');
const tenantRoutes = require('./routes/tenants');
const unitRoutes = require('./routes/units');
const paymentRoutes = require('./routes/payments');
const maintenanceRoutes = require('./routes/maintenance');
const feedbackRoutes = require('./routes/feedback');
const reportRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database sync failed:', err);
});

module.exports = app;
