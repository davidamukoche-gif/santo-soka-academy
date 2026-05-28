import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import api from '../../utils/api';

const TenantFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/feedback');
        setFeedbacks(res.data);
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
        <h1 className="page-title">My Feedback</h1>
        <Link to="/portal/feedback/new" className="btn btn-primary"><FiPlus /> Submit Feedback</Link>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {feedbacks.length === 0 ? (
          <div className="card empty-state"><h3>No feedback submitted yet</h3></div>
        ) : (
          feedbacks.map(f => (
            <div key={f.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <span className={`badge badge-${f.category}`} style={{ marginRight: 8, textTransform: 'capitalize' }}>
                    {f.category?.replace('_', ' ')}
                  </span>
                  <span className={`badge badge-${f.status}`}>{f.status}</span>
                </div>
                <span style={{ color: '#d69e2e' }}>{'★'.repeat(f.rating || 0)}{'☆'.repeat(5 - (f.rating || 0))}</span>
              </div>
              <p style={{ marginBottom: 8 }}>{f.message}</p>
              <div style={{ fontSize: '0.8rem', color: '#718096' }}>{new Date(f.createdAt).toLocaleDateString()}</div>
              {f.adminReply && (
                <div style={{ marginTop: 12, padding: 12, background: '#f7fafc', borderRadius: 8, borderLeft: '3px solid #2b6cb0' }}>
                  <strong style={{ fontSize: '0.8rem', color: '#2b6cb0' }}>Admin Reply:</strong>
                  <p style={{ marginTop: 4, fontSize: '0.85rem' }}>{f.adminReply}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TenantFeedback;
