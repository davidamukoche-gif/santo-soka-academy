import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [replyingId, setReplyingId] = useState(null);
  const [replyData, setReplyData] = useState({ adminReply: '', status: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchFeedbacks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter]);

  const fetchFeedbacks = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      const res = await api.get('/feedback', { params });
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (id) => {
    try {
      await api.put(`/feedback/${id}`, replyData);
      setReplyingId(null);
      fetchFeedbacks();
    } catch (err) {
      alert('Error updating feedback');
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating || 0) + '☆'.repeat(5 - (rating || 0));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Feedback ({feedbacks.length})</h1>
      </div>

      <div className="filters">
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
        <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          <option value="security">Security</option>
          <option value="cleanliness">Cleanliness</option>
          <option value="water">Water</option>
          <option value="noise">Noise</option>
          <option value="staff_behavior">Staff Behavior</option>
          <option value="general">General</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {feedbacks.length === 0 ? (
          <div className="card empty-state"><h3>No feedback found</h3></div>
        ) : (
          feedbacks.map(f => (
            <div key={f.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <span className={`badge badge-${f.category}`} style={{ marginRight: 8 }}>{f.category?.replace('_', ' ')}</span>
                  <span className={`badge badge-${f.status}`}>{f.status}</span>
                </div>
                <span style={{ color: '#d69e2e', fontSize: '1.1rem' }}>{renderStars(f.rating)}</span>
              </div>
              <p style={{ marginBottom: 8 }}>{f.message}</p>
              <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                By: {f.tenant?.user?.name} | {new Date(f.createdAt).toLocaleDateString()}
              </div>

              {f.adminReply && (
                <div style={{ marginTop: 12, padding: 12, background: '#f7fafc', borderRadius: 8, borderLeft: '3px solid #2b6cb0' }}>
                  <strong style={{ fontSize: '0.8rem', color: '#2b6cb0' }}>Admin Reply:</strong>
                  <p style={{ marginTop: 4, fontSize: '0.85rem' }}>{f.adminReply}</p>
                </div>
              )}

              {['admin', 'caretaker'].includes(user?.role) && (
                <div style={{ marginTop: 12 }}>
                  {replyingId === f.id ? (
                    <div>
                      <textarea
                        className="form-textarea"
                        value={replyData.adminReply}
                        onChange={(e) => setReplyData({ ...replyData, adminReply: e.target.value })}
                        placeholder="Type your reply..."
                        style={{ minHeight: 60 }}
                      />
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                        <select
                          className="filter-select"
                          value={replyData.status}
                          onChange={(e) => setReplyData({ ...replyData, status: e.target.value })}
                        >
                          <option value="reviewed">Reviewed</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button onClick={() => handleReply(f.id)} className="btn btn-sm btn-success">Send</button>
                        <button onClick={() => setReplyingId(null)} className="btn btn-sm btn-secondary">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setReplyingId(f.id); setReplyData({ adminReply: f.adminReply || '', status: 'reviewed' }); }}
                      className="btn btn-sm btn-primary"
                    >
                      Reply
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
