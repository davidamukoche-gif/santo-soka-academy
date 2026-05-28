import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../utils/api';

const COLORS = ['#2b6cb0', '#38a169', '#e53e3e', '#d69e2e', '#805ad5', '#dd6b20', '#319795'];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('income');
  const [incomeData, setIncomeData] = useState(null);
  const [outstandingData, setOutstandingData] = useState(null);
  const [vacantData, setVacantData] = useState(null);
  const [maintenanceData, setMaintenanceData] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [inc, out, vac, mnt, fb] = await Promise.all([
          api.get('/reports/income'),
          api.get('/reports/outstanding'),
          api.get('/reports/vacant-units'),
          api.get('/reports/maintenance'),
          api.get('/reports/feedback-stats'),
        ]);
        setIncomeData(inc.data);
        setOutstandingData(out.data);
        setVacantData(vac.data);
        setMaintenanceData(mnt.data);
        setFeedbackData(fb.data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const formatCurrency = (val) => `KES ${Number(val || 0).toLocaleString()}`;

  const tabs = [
    { id: 'income', label: 'Monthly Income' },
    { id: 'outstanding', label: 'Outstanding Balances' },
    { id: 'vacant', label: 'Vacant Units' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'feedback', label: 'Feedback Stats' },
  ];

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'income' && incomeData && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 4, color: '#1a365d' }}>Annual Revenue - {incomeData.year}</h3>
            <p style={{ color: '#38a169', fontSize: '1.5rem', fontWeight: 700 }}>{formatCurrency(incomeData.yearTotal)}</p>
          </div>
          <div className="card">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={incomeData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(0, 3)} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="total" fill="#2b6cb0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'outstanding' && outstandingData && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ color: '#1a365d' }}>Outstanding Balances - {outstandingData.month} {outstandingData.year}</h3>
            <p style={{ color: '#e53e3e', fontSize: '1.5rem', fontWeight: 700 }}>{formatCurrency(outstandingData.totalOutstanding)}</p>
            <p style={{ color: '#718096', fontSize: '0.85rem' }}>{outstandingData.outstanding?.length} tenants with outstanding balances</p>
          </div>
          <div className="card">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Unit</th>
                    <th>Rent</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {outstandingData.outstanding?.map((o, i) => (
                    <tr key={i}>
                      <td>{o.tenant}</td>
                      <td>{o.unit}</td>
                      <td>{formatCurrency(o.rentAmount)}</td>
                      <td>{formatCurrency(o.totalPaid)}</td>
                      <td style={{ fontWeight: 600, color: '#e53e3e' }}>{formatCurrency(o.balance)}</td>
                      <td><span className={`badge badge-${o.status === 'unpaid' ? 'overdue' : 'partial'}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vacant' && vacantData && (
        <div>
          <div className="stats-grid" style={{ marginBottom: 20 }}>
            <div className="stat-card">
              <div className="stat-icon red"><span style={{ fontWeight: 700 }}>{vacantData.summary?.total}</span></div>
              <div className="stat-info"><p>Total Vacant</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><span style={{ fontWeight: 700 }}>{vacantData.summary?.byType?.bedsitter}</span></div>
              <div className="stat-info"><p>Bedsitters</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><span style={{ fontWeight: 700 }}>{vacantData.summary?.byType?.['1bedroom']}</span></div>
              <div className="stat-info"><p>1 Bedroom</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple"><span style={{ fontWeight: 700 }}>{vacantData.summary?.byType?.['2bedroom']}</span></div>
              <div className="stat-info"><p>2 Bedroom</p></div>
            </div>
          </div>
          <div className="card">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr><th>Unit</th><th>Block</th><th>Floor</th><th>Type</th><th>Rent</th></tr>
                </thead>
                <tbody>
                  {vacantData.vacantUnits?.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>{u.unitNumber}</td>
                      <td>{u.block}</td>
                      <td>{u.floor}</td>
                      <td style={{ textTransform: 'capitalize' }}>{u.unitType}</td>
                      <td>{formatCurrency(u.rentAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && maintenanceData && (
        <div className="grid-2">
          <div className="card">
            <h3 style={{ marginBottom: 16, color: '#1a365d' }}>By Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={Object.entries(maintenanceData.byStatus).map(([k, v]) => ({ name: k.replace('_', ' '), value: v }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {Object.keys(maintenanceData.byStatus).map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 16, color: '#1a365d' }}>By Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={Object.entries(maintenanceData.byCategory).map(([k, v]) => ({ name: k.replace('_', ' '), count: v }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#805ad5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && feedbackData && (
        <div className="grid-2">
          <div className="card">
            <h3 style={{ marginBottom: 16, color: '#1a365d' }}>Feedback Statistics</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <div><strong>Total Feedback:</strong> {feedbackData.total}</div>
              <div><strong>Average Rating:</strong> <span style={{ color: '#d69e2e' }}>{'★'.repeat(Math.round(feedbackData.avgRating))}</span> ({feedbackData.avgRating}/5)</div>
              <div><strong>Pending:</strong> {feedbackData.byStatus?.pending}</div>
              <div><strong>Reviewed:</strong> {feedbackData.byStatus?.reviewed}</div>
              <div><strong>Resolved:</strong> {feedbackData.byStatus?.resolved}</div>
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 16, color: '#1a365d' }}>By Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={Object.entries(feedbackData.byCategory).map(([k, v]) => ({ name: k.replace('_', ' '), value: v }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {Object.keys(feedbackData.byCategory).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
