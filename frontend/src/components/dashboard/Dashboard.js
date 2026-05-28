import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiHome, FiUsers, FiDollarSign, FiAlertCircle, FiTool } from 'react-icons/fi';
import api from '../../utils/api';

const COLORS = ['#2b6cb0', '#38a169', '#e53e3e', '#d69e2e', '#805ad5', '#dd6b20'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashRes = await api.get('/dashboard');
        setData(dashRes.data);
        try {
          const incomeRes = await api.get('/reports/income');
          setIncomeData(incomeRes.data.monthlyData || []);
        } catch (e) {
          console.warn('Income report not available');
        }
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!data) return <div className="alert alert-error">Failed to load dashboard data</div>;

  const { stats } = data;

  const occupancyData = [
    { name: 'Occupied', value: stats.occupiedUnits },
    { name: 'Vacant', value: stats.vacantUnits },
  ];

  const formatCurrency = (val) => `KES ${Number(val).toLocaleString()}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><FiHome /></div>
          <div className="stat-info">
            <h3>{stats.totalUnits}</h3>
            <p>Total Units</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><FiHome /></div>
          <div className="stat-info">
            <h3>{stats.occupiedUnits}</h3>
            <p>Occupied</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><FiHome /></div>
          <div className="stat-info">
            <h3>{stats.vacantUnits}</h3>
            <p>Vacant</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><FiUsers /></div>
          <div className="stat-info">
            <h3>{stats.totalTenants}</h3>
            <p>Active Tenants</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><FiDollarSign /></div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.monthlyRevenue)}</h3>
            <p>Revenue This Month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><FiDollarSign /></div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.pendingPayments)}</h3>
            <p>Pending Payments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><FiAlertCircle /></div>
          <div className="stat-info">
            <h3>{stats.overdueTenants}</h3>
            <p>Overdue Tenants</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><FiTool /></div>
          <div className="stat-info">
            <h3>{stats.openMaintenance}</h3>
            <p>Open Requests</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 16, color: '#1a365d' }}>Monthly Revenue (2026)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(0, 3)} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="total" fill="#2b6cb0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16, color: '#1a365d' }}>Occupancy Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={occupancyData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {occupancyData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ color: '#1a365d' }}>Recent Payments</h3>
            <Link to="/payments" className="btn btn-sm btn-secondary">View All</Link>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Unit</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPayments?.map(p => (
                  <tr key={p.id}>
                    <td>{p.tenant?.user?.name}</td>
                    <td>{p.unit?.unitNumber}</td>
                    <td>{formatCurrency(p.amount)}</td>
                    <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ color: '#1a365d' }}>Recent Maintenance</h3>
            <Link to="/maintenance" className="btn btn-sm btn-secondary">View All</Link>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Unit</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentMaintenance?.map(m => (
                  <tr key={m.id}>
                    <td>{m.title}</td>
                    <td>{m.unit?.unitNumber}</td>
                    <td><span className={`badge badge-${m.priority}`}>{m.priority}</span></td>
                    <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {data.upcomingLeaseExpiries?.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 12, color: '#1a365d' }}>Upcoming Lease Expiries (30 days)</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Unit</th>
                  <th>Lease End</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {data.upcomingLeaseExpiries.map(t => (
                  <tr key={t.id}>
                    <td>{t.user?.name}</td>
                    <td>{t.unit?.unitNumber}</td>
                    <td>{t.leaseEnd}</td>
                    <td>{t.user?.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
