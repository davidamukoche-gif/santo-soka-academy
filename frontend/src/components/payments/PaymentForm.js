import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const PaymentForm = () => {
  const navigate = useNavigate();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();

  const [form, setForm] = useState({
    tenantId: '',
    amount: '',
    paymentMethod: 'mpesa',
    transactionCode: '',
    paymentDate: now.toISOString().split('T')[0],
    month: months[now.getMonth()],
    year: now.getFullYear().toString(),
    notes: '',
  });
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await api.get('/tenants', { params: { status: 'active' } });
        setTenants(res.data);
      } catch (err) {
        console.error('Error fetching tenants:', err);
      }
    };
    fetchTenants();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/payments', form);
      navigate('/payments');
    } catch (err) {
      setError(err.response?.data?.error || 'Error recording payment');
    } finally {
      setLoading(false);
    }
  };

  const selectedTenant = tenants.find(t => String(t.id) === String(form.tenantId));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Record Payment</h1>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tenant *</label>
            <select name="tenantId" className="form-select" value={form.tenantId} onChange={handleChange} required>
              <option value="">-- Select Tenant --</option>
              {tenants.map(t => (
                <option key={t.id} value={t.id}>
                  {t.user?.name} - {t.unit?.unitNumber || 'No Unit'} (KES {t.unit ? Number(t.unit.rentAmount).toLocaleString() : '0'})
                </option>
              ))}
            </select>
          </div>

          {selectedTenant?.unit && (
            <div className="alert alert-success" style={{ marginBottom: 16 }}>
              Unit: {selectedTenant.unit.unitNumber} | Monthly Rent: KES {Number(selectedTenant.unit.rentAmount).toLocaleString()}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (KES) *</label>
              <input type="number" name="amount" className="form-input" value={form.amount} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Method *</label>
              <select name="paymentMethod" className="form-select" value={form.paymentMethod} onChange={handleChange}>
                <option value="mpesa">M-Pesa</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Date *</label>
              <input type="date" name="paymentDate" className="form-input" value={form.paymentDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Transaction Code</label>
              <input type="text" name="transactionCode" className="form-input" value={form.transactionCode} onChange={handleChange} placeholder="e.g. M-Pesa code" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Month *</label>
              <select name="month" className="form-select" value={form.month} onChange={handleChange}>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Year *</label>
              <input type="number" name="year" className="form-input" value={form.year} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea name="notes" className="form-textarea" value={form.notes} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/payments')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
