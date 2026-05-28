import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const MaintenanceList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, priorityFilter]);

  const fetchRequests = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const res = await api.get('/maintenance', { params });
      setRequests(res.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/maintenance/${id}`, editData);
      setEditingId(null);
      fetchRequests();
    } catch (err) {
      alert('Error updating request');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Maintenance Requests ({requests.length})</h1>
        <Link to={user?.role === 'tenant' ? '/portal/maintenance/new' : '/maintenance/new'} className="btn btn-primary">
          <FiPlus /> New Request
        </Link>
      </div>

      <div className="filters">
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select className="filter-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Tenant</th>
                <th>Unit</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                {['admin', 'caretaker'].includes(user?.role) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 24 }}>No requests found</td></tr>
              ) : (
                requests.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.title}</td>
                    <td style={{ textTransform: 'capitalize' }}>{r.category?.replace('_', ' ')}</td>
                    <td>{r.tenant?.user?.name}</td>
                    <td>{r.unit?.unitNumber || '-'}</td>
                    <td><span className={`badge badge-${r.priority}`}>{r.priority}</span></td>
                    <td>
                      {editingId === r.id ? (
                        <select
                          value={editData.status || r.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="filter-select"
                          style={{ minWidth: 'auto' }}
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span className={`badge badge-${r.status}`}>{r.status?.replace('_', ' ')}</span>
                      )}
                    </td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    {['admin', 'caretaker'].includes(user?.role) && (
                      <td>
                        {editingId === r.id ? (
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button onClick={() => handleUpdate(r.id)} className="btn btn-sm btn-success">Save</button>
                            <button onClick={() => setEditingId(null)} className="btn btn-sm btn-secondary">Cancel</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingId(r.id); setEditData({ status: r.status, priority: r.priority }); }}
                            className="btn btn-sm btn-primary"
                          >
                            Update
                          </button>
                        )}
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

export default MaintenanceList;
