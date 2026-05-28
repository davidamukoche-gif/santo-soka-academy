import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const data = { name: form.name, phone: form.phone };
      if (form.newPassword) {
        data.currentPassword = form.currentPassword;
        data.newPassword = form.newPassword;
      }
      await updateProfile(data);
      setMessage('Profile updated successfully');
      setForm({ ...form, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="card" style={{ maxWidth: 500 }}>
        <h3 style={{ marginBottom: 16, color: '#1a365d' }}>Profile Settings</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={user?.email || ''} disabled style={{ background: '#f7fafc' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input type="text" name="phone" className="form-input" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <input type="text" className="form-input" value={user?.role || ''} disabled style={{ background: '#f7fafc', textTransform: 'capitalize' }} />
          </div>

          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

          <h4 style={{ marginBottom: 12, color: '#4a5568' }}>Change Password</h4>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input type="password" name="currentPassword" className="form-input" value={form.currentPassword} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" name="newPassword" className="form-input" value={form.newPassword} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input type="password" name="confirmPassword" className="form-input" value={form.confirmPassword} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
