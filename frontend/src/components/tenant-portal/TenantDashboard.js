import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCreditCard, FiTool, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const TenantDashboard = () => {
  const { user } = useAuth();
  const [tenant, setTenant] = useState(null);
  const [payments, setPayments] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.tenantId) {
          const [tenantRes, paymentsRes, maintenanceRes] = await Promise.all([
            api.get(`/tenants/${user.tenantId}`),
            api.get('/payments'),
            api.get('/maintenance'),
          ]);
          setTenant(tenantRes.data);
          setPayments(paymentsRes.data);
          setMaintenance(maintenanceRes.data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="loading">Loading...</div>;

  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });
  const rentAmount = tenant?.unit ? parseFloat(tenant.unit.rentAmount) : 0;
  const monthPayments = payments.filter(p => p.month === currentMonth && p.year === now.getFullYear());
  const totalPaid = monthPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const balance = Math.max(0, rentAmount - totalPaid);
  const openRequests = maintenance.filter(m => m.status !== 'completed').length;

  const formatCurrency = (val) => `KES ${Number(val || 0).toLocaleString()}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome, {user?.name}</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><FiCreditCard /></div>
          <div className="stat-info">
            <h3>{formatCurrency(rentAmount)}</h3>
            <p>Monthly Rent</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><FiCreditCard /></div>
          <div className="stat-info">
            <h3>{formatCurrency(totalPaid)}</h3>
            <p>Paid This Month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><FiAlertCircle /></div>
          <div className="stat-info">
            <h3>{formatCurrency(balance)}</h3>
            <p>Balance Due</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><FiTool /></div>
          <div className="stat-info">
            <h3>{openRequests}</h3>
            <p>Open Requests</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 12, color: '#1a365d' }}>Unit Information</h3>
          {tenant?.unit ? (
            <div style={{ display: 'grid', gap: 10, fontSize: '0.9rem' }}>
              <div><strong>Unit:</strong> {tenant.unit.unitNumber}</div>
              <div><strong>Block:</strong> {tenant.unit.block}</div>
              <div><strong>Floor:</strong> {tenant.unit.floor}</div>
              <div><strong>Type:</strong> <span style={{ textTransform: 'capitalize' }}>{tenant.unit.unitType}</span></div>
              <div><strong>Lease:</strong> {tenant.leaseStart} to {tenant.leaseEnd}</div>
            </div>
          ) : (
            <p style={{ color: '#718096' }}>No unit assigned</p>
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ color: '#1a365d' }}>Quick Actions</h3>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <Link to="/portal/payments" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              <FiCreditCard /> View Payments
            </Link>
            <Link to="/portal/maintenance/new" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <FiTool /> Submit Maintenance Request
            </Link>
            <Link to="/portal/feedback/new" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <FiMessageSquare /> Submit Feedback
            </Link>
          </div>
        </div>
      </div>

      {payments.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 12, color: '#1a365d' }}>Recent Payments</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 5).map(p => (
                  <tr key={p.id}>
                    <td>{p.paymentDate}</td>
                    <td>{p.month} {p.year}</td>
                    <td>{formatCurrency(p.amount)}</td>
                    <td style={{ textTransform: 'uppercase' }}>{p.paymentMethod}</td>
                    <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantDashboard;
