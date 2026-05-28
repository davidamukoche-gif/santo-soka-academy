import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';

const UnitForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    unitNumber: '', floor: '', block: '', unitType: 'bedsitter',
    rentAmount: '', utilityMeterElectricity: '', utilityMeterWater: '', notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchUnit = async () => {
        try {
          const res = await api.get(`/units/${id}`);
          const u = res.data;
          setForm({
            unitNumber: u.unitNumber || '',
            floor: u.floor || '',
            block: u.block || '',
            unitType: u.unitType || 'bedsitter',
            rentAmount: u.rentAmount || '',
            utilityMeterElectricity: u.utilityMeterElectricity || '',
            utilityMeterWater: u.utilityMeterWater || '',
            notes: u.notes || '',
          });
        } catch (err) {
          setError('Error loading unit');
        }
      };
      fetchUnit();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/units/${id}`, form);
      } else {
        await api.post('/units', form);
      }
      navigate('/units');
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving unit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Edit Unit' : 'Add New Unit'}</h1>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Unit Number *</label>
              <input type="text" name="unitNumber" className="form-input" value={form.unitNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Type *</label>
              <select name="unitType" className="form-select" value={form.unitType} onChange={handleChange}>
                <option value="bedsitter">Bedsitter</option>
                <option value="1bedroom">1 Bedroom</option>
                <option value="2bedroom">2 Bedroom</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Block</label>
              <input type="text" name="block" className="form-input" value={form.block} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Floor</label>
              <input type="text" name="floor" className="form-input" value={form.floor} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Monthly Rent (KES) *</label>
            <input type="number" name="rentAmount" className="form-input" value={form.rentAmount} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Electricity Meter</label>
              <input type="text" name="utilityMeterElectricity" className="form-input" value={form.utilityMeterElectricity} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Water Meter</label>
              <input type="text" name="utilityMeterWater" className="form-input" value={form.utilityMeterWater} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea name="notes" className="form-textarea" value={form.notes} onChange={handleChange} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? 'Update Unit' : 'Add Unit')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/units')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitForm;
