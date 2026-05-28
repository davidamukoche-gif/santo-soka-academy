import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const TenantProfile = () => {
  const { user } = useAuth();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (user?.tenantId) {
          const res = await api.get(`/tenants/${user.tenantId}`);
          setTenant(res.data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (loading) return <div className="loading">Loading...</div>;

  const formatCurrency = (val) => `KES ${Number(val || 0).toLocaleString()}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 16, color: '#1a365d' }}>Personal Information</h3>
          <div style={{ display: 'grid', gap: 12, fontSize: '0.9rem' }}>
            <div><strong>Name:</strong> {user?.name}</div>
            <div><strong>Email:</strong> {user?.email}</div>
            <div><strong>Phone:</strong> {user?.phone || '-'}</div>
            <div><strong>National ID:</strong> {tenant?.nationalId || '-'}</div>
            <div><strong>Emergency Contact:</strong> {tenant?.emergencyContact || '-'}</div>
            <div><strong>Emergency Phone:</strong> {tenant?.emergencyContactPhone || '-'}</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16, color: '#1a365d' }}>Lease & Unit</h3>
          {tenant?.unit ? (
            <div style={{ display: 'grid', gap: 12, fontSize: '0.9rem' }}>
              <div><strong>Unit:</strong> {tenant.unit.unitNumber}</div>
              <div><strong>Block:</strong> {tenant.unit.block}</div>
              <div><strong>Floor:</strong> {tenant.unit.floor}</div>
              <div><strong>Type:</strong> <span style={{ textTransform: 'capitalize' }}>{tenant.unit.unitType}</span></div>
              <div><strong>Monthly Rent:</strong> {formatCurrency(tenant.unit.rentAmount)}</div>
              <div><strong>Deposit Paid:</strong> {formatCurrency(tenant.deposit)}</div>
              <div><strong>Lease Start:</strong> {tenant.leaseStart}</div>
              <div><strong>Lease End:</strong> {tenant.leaseEnd}</div>
              <div><strong>Status:</strong> <span className={`badge badge-${tenant.status}`}>{tenant.status}</span></div>
            </div>
          ) : (
            <p style={{ color: '#718096' }}>No unit assigned</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantProfile;
