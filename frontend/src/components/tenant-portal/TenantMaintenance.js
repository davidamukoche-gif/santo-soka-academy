import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import api from '../../utils/api';

const TenantMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/maintenance');
        setRequests(res.data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Maintenance Requests</h1>
        <Link to="/portal/maintenance/new" className="btn btn-primary"><FiPlus /> New Request</Link>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 24 }}>No requests</td></tr>
              ) : (
                requests.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.title}</td>
                    <td style={{ textTransform: 'capitalize' }}>{r.category?.replace('_', ' ')}</td>
                    <td><span className={`badge badge-${r.priority}`}>{r.priority}</span></td>
                    <td><span className={`badge badge-${r.status}`}>{r.status?.replace('_', ' ')}</span></td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
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

export default TenantMaintenance;
