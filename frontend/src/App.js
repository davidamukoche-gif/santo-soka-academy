import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import TenantList from './components/tenants/TenantList';
import TenantForm from './components/tenants/TenantForm';
import TenantDetail from './components/tenants/TenantDetail';
import UnitList from './components/units/UnitList';
import UnitForm from './components/units/UnitForm';
import PaymentList from './components/payments/PaymentList';
import PaymentForm from './components/payments/PaymentForm';
import MaintenanceList from './components/maintenance/MaintenanceList';
import MaintenanceForm from './components/maintenance/MaintenanceForm';
import FeedbackList from './components/feedback/FeedbackList';
import FeedbackForm from './components/feedback/FeedbackForm';
import Reports from './components/reports/Reports';
import Settings from './components/settings/Settings';
import TenantDashboard from './components/tenant-portal/TenantDashboard';
import TenantPayments from './components/tenant-portal/TenantPayments';
import TenantMaintenance from './components/tenant-portal/TenantMaintenance';
import TenantFeedback from './components/tenant-portal/TenantFeedback';
import TenantProfile from './components/tenant-portal/TenantProfile';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Admin/Caretaker Routes */}
      <Route path="/" element={
        <PrivateRoute roles={['admin', 'caretaker']}>
          <Layout><Dashboard /></Layout>
        </PrivateRoute>
      } />
      <Route path="/tenants" element={
        <PrivateRoute roles={['admin', 'caretaker']}>
          <Layout><TenantList /></Layout>
        </PrivateRoute>
      } />
      <Route path="/tenants/new" element={
        <PrivateRoute roles={['admin', 'caretaker']}>
          <Layout><TenantForm /></Layout>
        </PrivateRoute>
      } />
      <Route path="/tenants/:id" element={
        <PrivateRoute roles={['admin', 'caretaker']}>
          <Layout><TenantDetail /></Layout>
        </PrivateRoute>
      } />
      <Route path="/tenants/:id/edit" element={
        <PrivateRoute roles={['admin', 'caretaker']}>
          <Layout><TenantForm /></Layout>
        </PrivateRoute>
      } />
      <Route path="/units" element={
        <PrivateRoute roles={['admin', 'caretaker']}>
          <Layout><UnitList /></Layout>
        </PrivateRoute>
      } />
      <Route path="/units/new" element={
        <PrivateRoute roles={['admin']}>
          <Layout><UnitForm /></Layout>
        </PrivateRoute>
      } />
      <Route path="/units/:id/edit" element={
        <PrivateRoute roles={['admin']}>
          <Layout><UnitForm /></Layout>
        </PrivateRoute>
      } />
      <Route path="/payments" element={
        <PrivateRoute roles={['admin', 'caretaker']}>
          <Layout><PaymentList /></Layout>
        </PrivateRoute>
      } />
      <Route path="/payments/new" element={
        <PrivateRoute roles={['admin', 'caretaker']}>
          <Layout><PaymentForm /></Layout>
        </PrivateRoute>
      } />
      <Route path="/maintenance" element={
        <PrivateRoute roles={['admin', 'caretaker']}>
          <Layout><MaintenanceList /></Layout>
        </PrivateRoute>
      } />
      <Route path="/maintenance/new" element={
        <PrivateRoute roles={['admin', 'caretaker']}>
          <Layout><MaintenanceForm /></Layout>
        </PrivateRoute>
      } />
      <Route path="/feedback" element={
        <PrivateRoute roles={['admin', 'caretaker']}>
          <Layout><FeedbackList /></Layout>
        </PrivateRoute>
      } />
      <Route path="/reports" element={
        <PrivateRoute roles={['admin']}>
          <Layout><Reports /></Layout>
        </PrivateRoute>
      } />
      <Route path="/settings" element={
        <PrivateRoute>
          <Layout><Settings /></Layout>
        </PrivateRoute>
      } />

      {/* Tenant Portal Routes */}
      <Route path="/portal" element={
        <PrivateRoute roles={['tenant']}>
          <Layout><TenantDashboard /></Layout>
        </PrivateRoute>
      } />
      <Route path="/portal/payments" element={
        <PrivateRoute roles={['tenant']}>
          <Layout><TenantPayments /></Layout>
        </PrivateRoute>
      } />
      <Route path="/portal/maintenance" element={
        <PrivateRoute roles={['tenant']}>
          <Layout><TenantMaintenance /></Layout>
        </PrivateRoute>
      } />
      <Route path="/portal/maintenance/new" element={
        <PrivateRoute roles={['tenant']}>
          <Layout><MaintenanceForm /></Layout>
        </PrivateRoute>
      } />
      <Route path="/portal/feedback" element={
        <PrivateRoute roles={['tenant']}>
          <Layout><TenantFeedback /></Layout>
        </PrivateRoute>
      } />
      <Route path="/portal/feedback/new" element={
        <PrivateRoute roles={['tenant']}>
          <Layout><FeedbackForm /></Layout>
        </PrivateRoute>
      } />
      <Route path="/portal/profile" element={
        <PrivateRoute roles={['tenant']}>
          <Layout><TenantProfile /></Layout>
        </PrivateRoute>
      } />

      <Route path="*" element={
        user?.role === 'tenant' ? <Navigate to="/portal" /> : <Navigate to="/" />
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
