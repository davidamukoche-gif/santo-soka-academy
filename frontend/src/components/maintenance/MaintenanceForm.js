import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const MaintenanceForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
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
      await api.post('/maintenance', form);
      navigate(user?.role === 'tenant' ? '/portal/maintenance' : '/maintenance');
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Submit Maintenance Request</h1>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Issue Title *</label>
            <input type="text" name="title" className="form-input" value={form.title} onChange={handleChange} required placeholder="Brief description of the issue" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                <option value="plumbing">Plumbing</option>
                <option value="electricity">Electricity</option>
                <option value="broken_door_window">Broken Door/Window</option>
                <option value="noise">Noise Complaint</option>
                <option value="water">Water Issue</option>
                <option value="internet">Internet Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select name="priority" className="form-select" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} placeholder="Provide details about the issue..." />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(user?.role === 'tenant' ? '/portal/maintenance' : '/maintenance')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceForm;
