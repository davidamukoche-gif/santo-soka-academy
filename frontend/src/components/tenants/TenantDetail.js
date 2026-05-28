import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiEdit2, FiArrowLeft } from 'react-icons/fi';
import api from '../../utils/api';

const TenantDetail = () => {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await api.get(`/tenants/${id}`);
        setTenant(res.data);
      } catch (err) {
        console.error('Error fetching tenant:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [id]);

  if (loading) return <div className="loading">Loading tenant...</div>;
  if (!tenant) return <div className="alert alert-error">Tenant not found</div>;

  const formatCurrency = (val) => `KES ${Number(val || 0).toLocaleString()}`;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/tenants" className="btn btn-secondary"><FiArrowLeft /></Link>
          <h1 className="page-title">{tenant.user?.name}</h1>
          <span className={`badge badge-${tenant.status}`}>{tenant.status}</span>
        </div>
        <Link to={`/tenants/${id}/edit`} className="btn btn-primary"><FiEdit2 /> Edit</Link>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 16, color: '#1a365d' }}>Personal Information</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <div><strong>Email:</strong> {tenant.user?.email}</div>
            <div><strong>Phone:</strong> {tenant.user?.phone || '-'}</div>
            <div><strong>National ID:</strong> {tenant.nationalId || '-'}</div>
            <div><strong>Emergency Contact:</strong> {tenant.emergencyContact || '-'}</div>
            <div><strong>Emergency Phone:</strong> {tenant.emergencyContactPhone || '-'}</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16, color: '#1a365d' }}>Lease Information</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <div><strong>Unit:</strong> {tenant.unit?.unitNumber || 'Not Assigned'}</div>
            <div><strong>Unit Type:</strong> {tenant.unit?.unitType || '-'}</div>
            <div><strong>Monthly Rent:</strong> {tenant.unit ? formatCurrency(tenant.unit.rentAmount) : '-'}</div>
            <div><strong>Deposit:</strong> {formatCurrency(tenant.deposit)}</div>
            <div><strong>Lease Start:</strong> {tenant.leaseStart || '-'}</div>
            <div><strong>Lease End:</strong> {tenant.leaseEnd || '-'}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 16, color: '#1a365d' }}>Payment History</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Transaction</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(!tenant.payments || tenant.payments.length === 0) ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 24 }}>No payments recorded</td></tr>
              ) : (
                tenant.payments.map(p => (
                  <tr key={p.id}>
                    <td>{p.paymentDate}</td>
                    <td>{p.month} {p.year}</td>
                    <td>{formatCurrency(p.amount)}</td>
                    <td style={{ textTransform: 'uppercase' }}>{p.paymentMethod}</td>
                    <td>{p.transactionCode || '-'}</td>
                    <td>{formatCurrency(p.balance)}</td>
                    <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantDetail;
