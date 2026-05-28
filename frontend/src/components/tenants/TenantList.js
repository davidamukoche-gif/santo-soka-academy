import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api';

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTenants();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchTenants = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/tenants', { params });
      setTenants(res.data);
    } catch (err) {
      console.error('Error fetching tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this tenant?')) return;
    try {
      await api.delete(`/tenants/${id}`);
      fetchTenants();
    } catch (err) {
      alert('Error removing tenant');
    }
  };

  const filtered = tenants.filter(t => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      t.user?.name?.toLowerCase().includes(s) ||
      t.user?.email?.toLowerCase().includes(s) ||
      t.unit?.unitNumber?.toLowerCase().includes(s) ||
      t.nationalId?.toLowerCase().includes(s)
    );
  });

  if (loading) return <div className="loading">Loading tenants...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tenants ({filtered.length})</h1>
        <Link to="/tenants/new" className="btn btn-primary">
          <FiPlus /> Add Tenant
        </Link>
      </div>

      <div className="filters">
        <div style={{ position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: 10, color: '#a0aec0' }} />
          <input
            type="text"
            className="filter-input"
            placeholder="Search tenants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="moved_out">Moved Out</option>
          <option value="evicted">Evicted</option>
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Unit</th>
                <th>Rent</th>
                <th>Lease End</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 24 }}>No tenants found</td></tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500 }}>{t.user?.name}</td>
                    <td>{t.user?.email}</td>
                    <td>{t.user?.phone}</td>
                    <td>{t.unit?.unitNumber || '-'}</td>
                    <td>{t.unit ? `KES ${Number(t.unit.rentAmount).toLocaleString()}` : '-'}</td>
                    <td>{t.leaseEnd || '-'}</td>
                    <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link to={`/tenants/${t.id}`} className="btn btn-sm btn-secondary"><FiEye /></Link>
                        <Link to={`/tenants/${t.id}/edit`} className="btn btn-sm btn-primary"><FiEdit2 /></Link>
                        <button onClick={() => handleDelete(t.id)} className="btn btn-sm btn-danger"><FiTrash2 /></button>
                      </div>
                    </td>
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

export default TenantList;
