import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const UnitList = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchUnits();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter]);

  const fetchUnits = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.unitType = typeFilter;
      const res = await api.get('/units', { params });
      setUnits(res.data);
    } catch (err) {
      console.error('Error fetching units:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = units.filter(u => {
    if (!search) return true;
    const s = search.toLowerCase();
    return u.unitNumber.toLowerCase().includes(s) || u.tenant?.user?.name?.toLowerCase().includes(s);
  });

  const occupied = units.filter(u => u.status === 'occupied').length;
  const vacant = units.filter(u => u.status === 'vacant').length;

  if (loading) return <div className="loading">Loading units...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Units ({units.length})</h1>
        {user?.role === 'admin' && (
          <Link to="/units/new" className="btn btn-primary"><FiPlus /> Add Unit</Link>
        )}
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-icon blue"><span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{units.length}</span></div>
          <div className="stat-info"><p>Total Units</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{occupied}</span></div>
          <div className="stat-info"><p>Occupied</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{vacant}</span></div>
          <div className="stat-info"><p>Vacant</p></div>
        </div>
      </div>

      <div className="filters">
        <div style={{ position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: 10, color: '#a0aec0' }} />
          <input
            type="text"
            className="filter-input"
            placeholder="Search units..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="occupied">Occupied</option>
          <option value="vacant">Vacant</option>
        </select>
        <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="bedsitter">Bedsitter</option>
          <option value="1bedroom">1 Bedroom</option>
          <option value="2bedroom">2 Bedroom</option>
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Block</th>
                <th>Floor</th>
                <th>Type</th>
                <th>Rent</th>
                <th>Tenant</th>
                <th>Status</th>
                {user?.role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 24 }}>No units found</td></tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500 }}>{u.unitNumber}</td>
                    <td>{u.block || '-'}</td>
                    <td>{u.floor || '-'}</td>
                    <td style={{ textTransform: 'capitalize' }}>{u.unitType}</td>
                    <td>KES {Number(u.rentAmount).toLocaleString()}</td>
                    <td>{u.tenant?.user?.name || '-'}</td>
                    <td><span className={`badge badge-${u.status}`}>{u.status}</span></td>
                    {user?.role === 'admin' && (
                      <td>
                        <Link to={`/units/${u.id}/edit`} className="btn btn-sm btn-primary"><FiEdit2 /></Link>
                      </td>
                    )}
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

export default UnitList;
