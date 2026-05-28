import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';

const TenantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    nationalId: '', leaseStart: '', leaseEnd: '',
    deposit: '', emergencyContact: '', emergencyContactPhone: '',
    unitId: '', status: 'active',
  });
  const [units, setUnits] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnits();
    if (isEdit) fetchTenant();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUnits = async () => {
    try {
      const res = await api.get('/units');
      setUnits(res.data);
    } catch (err) {
      console.error('Error fetching units:', err);
    }
  };

  const fetchTenant = async () => {
    try {
      const res = await api.get(`/tenants/${id}`);
      const t = res.data;
      setForm({
        name: t.user?.name || '',
        email: t.user?.email || '',
        phone: t.user?.phone || '',
        password: '',
        nationalId: t.nationalId || '',
        leaseStart: t.leaseStart || '',
        leaseEnd: t.leaseEnd || '',
        deposit: t.deposit || '',
        emergencyContact: t.emergencyContact || '',
        emergencyContactPhone: t.emergencyContactPhone || '',
        unitId: t.unit?.id || '',
        status: t.status || 'active',
      });
    } catch (err) {
      setError('Error loading tenant');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/tenants/${id}`, form);
      } else {
        await api.post('/tenants', form);
      }
      navigate('/tenants');
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving tenant');
    } finally {
      setLoading(false);
    }
  };

  const availableUnits = units.filter(u => u.status === 'vacant' || (isEdit && u.tenantId && String(u.id) === String(form.unitId)));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Edit Tenant' : 'Add New Tenant'}</h1>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" name="email" className="form-input" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" name="phone" className="form-input" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">National ID / Passport</label>
              <input type="text" name="nationalId" className="form-input" value={form.nationalId} onChange={handleChange} />
            </div>
          </div>

          {!isEdit && (
            <div className="form-group">
              <label className="form-label">Password (default: tenant123)</label>
              <input type="password" name="password" className="form-input" value={form.password} onChange={handleChange} placeholder="Leave empty for default" />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Lease Start</label>
              <input type="date" name="leaseStart" className="form-input" value={form.leaseStart} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Lease End</label>
              <input type="date" name="leaseEnd" className="form-input" value={form.leaseEnd} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Deposit Amount</label>
              <input type="number" name="deposit" className="form-input" value={form.deposit} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Assign Unit</label>
              <select name="unitId" className="form-select" value={form.unitId} onChange={handleChange}>
                <option value="">-- No Unit --</option>
                {availableUnits.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.unitNumber} - {u.unitType} (KES {Number(u.rentAmount).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Emergency Contact Name</label>
              <input type="text" name="emergencyContact" className="form-input" value={form.emergencyContact} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Emergency Contact Phone</label>
              <input type="text" name="emergencyContactPhone" className="form-input" value={form.emergencyContactPhone} onChange={handleChange} />
            </div>
          </div>

          {isEdit && (
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="moved_out">Moved Out</option>
                <option value="evicted">Evicted</option>
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? 'Update Tenant' : 'Add Tenant')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/tenants')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantForm;
