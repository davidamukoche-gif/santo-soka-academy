import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiFileText } from 'react-icons/fi';
import api from '../../utils/api';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [receipt, setReceipt] = useState(null);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    fetchPayments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, monthFilter]);

  const fetchPayments = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (monthFilter) params.month = monthFilter;
      params.year = 2026;
      const res = await api.get('/payments', { params });
      setPayments(res.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewReceipt = async (id) => {
    try {
      const res = await api.get(`/payments/receipt/${id}`);
      setReceipt(res.data);
    } catch (err) {
      alert('Error loading receipt');
    }
  };

  const formatCurrency = (val) => `KES ${Number(val || 0).toLocaleString()}`;
  const totalCollected = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  if (loading) return <div className="loading">Loading payments...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Payments</h1>
        <Link to="/payments/new" className="btn btn-primary"><FiPlus /> Record Payment</Link>
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-icon green"><span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{payments.length}</span></div>
          <div className="stat-info"><p>Total Records</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><span style={{ fontSize: '0.7rem', fontWeight: 700 }}>KES</span></div>
          <div className="stat-info"><h3 style={{ fontSize: '1rem' }}>{formatCurrency(totalCollected)}</h3><p>Collected</p></div>
        </div>
      </div>

      <div className="filters">
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="overdue">Overdue</option>
          <option value="pending">Pending</option>
        </select>
        <select className="filter-select" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
          <option value="">All Months</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Tenant</th>
                <th>Unit</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: 24 }}>No payments found</td></tr>
              ) : (
                payments.map(p => (
                  <tr key={p.id}>
                    <td>{p.paymentDate}</td>
                    <td>{p.tenant?.user?.name}</td>
                    <td>{p.unit?.unitNumber}</td>
                    <td>{p.month} {p.year}</td>
                    <td style={{ fontWeight: 500 }}>{formatCurrency(p.amount)}</td>
                    <td style={{ textTransform: 'uppercase' }}>{p.paymentMethod}</td>
                    <td>{formatCurrency(p.balance)}</td>
                    <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                    <td>
                      <button onClick={() => viewReceipt(p.id)} className="btn btn-sm btn-secondary"><FiFileText /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {receipt && (
        <div className="modal-overlay" onClick={() => setReceipt(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Payment Receipt</h3>
              <button className="modal-close" onClick={() => setReceipt(null)}>&times;</button>
            </div>
            <div style={{ borderTop: '2px solid #1a365d', paddingTop: 16 }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <h2 style={{ color: '#1a365d' }}>RentFlow</h2>
                <p style={{ color: '#718096', fontSize: '0.85rem' }}>Payment Receipt</p>
              </div>
              <div style={{ display: 'grid', gap: 10, fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Receipt No:</span>
                  <span style={{ fontWeight: 600 }}>{receipt.receiptNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Date:</span>
                  <span>{receipt.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Tenant:</span>
                  <span>{receipt.tenant}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Unit:</span>
                  <span>{receipt.unit}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Period:</span>
                  <span>{receipt.month} {receipt.year}</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Amount Paid:</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#38a169' }}>{formatCurrency(receipt.amount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Payment Method:</span>
                  <span style={{ textTransform: 'uppercase' }}>{receipt.method}</span>
                </div>
                {receipt.transactionCode && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#718096' }}>Transaction Code:</span>
                    <span>{receipt.transactionCode}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Balance:</span>
                  <span style={{ color: parseFloat(receipt.balance) > 0 ? '#e53e3e' : '#38a169' }}>{formatCurrency(receipt.balance)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Status:</span>
                  <span className={`badge badge-${receipt.status}`}>{receipt.status}</span>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => window.print()} className="btn btn-primary">Print</button>
              <button onClick={() => setReceipt(null)} className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentList;
