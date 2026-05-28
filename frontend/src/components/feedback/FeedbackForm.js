import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const FeedbackForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    category: 'general',
    message: '',
    rating: 3,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/feedback', form);
      navigate(user?.role === 'tenant' ? '/portal/feedback' : '/feedback');
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Submit Feedback</h1>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select name="category" className="form-select" value={form.category} onChange={handleChange}>
              <option value="security">Security</option>
              <option value="cleanliness">Cleanliness</option>
              <option value="water">Water</option>
              <option value="noise">Noise</option>
              <option value="staff_behavior">Staff Behavior</option>
              <option value="general">General</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Your Feedback *</label>
            <textarea
              name="message"
              className="form-textarea"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Share your feedback, complaints, or suggestions..."
              style={{ minHeight: 120 }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, rating: r })}
                  style={{
                    fontSize: '1.5rem',
                    background: 'none',
                    color: r <= form.rating ? '#d69e2e' : '#e2e8f0',
                    padding: 4,
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(user?.role === 'tenant' ? '/portal/feedback' : '/feedback')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
