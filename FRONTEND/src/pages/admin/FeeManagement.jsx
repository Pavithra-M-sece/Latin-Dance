// Fee Management - Uses jsPDF via npm module import
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { paymentAPI } from '../../utils/api.js';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarCheck2,
  CreditCard,
  MessageSquare,
  User,
  Download,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import './AdminDashboard.css';
import './FeeManagement.css';



const SidebarItem = ({ label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link className={`side-item ${isActive ? 'active' : ''}`} to={to || '#'}>
      <span>{label}</span>
    </Link>
  );
};

const StatusBadge = ({ status }) => {
  const statusMap = {
    Paid: 'status-paid',
    Pending: 'status-pending',
    Overdue: 'status-overdue',
  };
  return <span className={`status-badge ${statusMap[status]}`}>{status}</span>;
};

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({ totals: { paid: 0, pending: 0, overdue: 0, cancelled: 0, outstanding: 0, count: { paid: 0, pending: 0, overdue: 0, cancelled: 0 } }, monthlyRevenue: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    fetchPayments();
    fetchSummary();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const payments = await paymentAPI.getAll();
      setFees(payments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const s = await paymentAPI.getSummary();
      setSummary(s);
    } catch (err) {
      // don't block page if summary fails; show inline error message
      console.error('Failed to fetch payments summary', err);
    }
  };

  const pendingCount = fees.filter(f => f.status === 'Pending').length;
  const overdueCount = fees.filter(f => f.status === 'Overdue').length;

  const generateReceipt = (fee) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Latin Dance Academy', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Payment Receipt', 105, 35, { align: 'center' });
    
    // Line
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    
    // Receipt details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    doc.text('Receipt Details:', 20, 55);
    doc.text(`Student Name: ${fee.student?.name || 'Unknown'}`, 20, 70);
    doc.text(`Class: ${fee.class?.name || 'Unknown'}`, 20, 80);
    doc.text(`Month: ${fee.month}`, 20, 90);
    doc.text(`Amount: $${fee.amount}`, 20, 100);
    doc.text(`Due Date: ${fee.dueDate}`, 20, 110);
    doc.text(`Payment Date: ${fee.paidDate || new Date().toLocaleDateString()}`, 20, 120);
    doc.text(`Status: ${fee.status}`, 20, 130);
    doc.text(`Payment Method: UPI`, 20, 140);
    
    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your payment!', 105, 160, { align: 'center' });
    doc.text('Latin Dance Academy - Making Dance Dreams Come True', 105, 170, { align: 'center' });
    
    // Save
    const studentName = fee.student?.name || 'Unknown';
    doc.save(`Receipt_${studentName.replace(/\s+/g, '_')}_${fee.month.replace(/\s+/g, '_')}.pdf`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleConfirmPayment = async () => {
    if (!upiId.trim()) {
      alert('Please enter UPI ID');
      return;
    }

    try {
      // Update payment status in database
      const updatedPayment = await paymentAPI.update(selectedFee._id, {
        status: 'Paid',
        paidDate: new Date(),
        transactionId: `UPI_${Date.now()}`
      });

      // Update local state
      setFees(prev =>
        prev.map(f =>
          f._id === selectedFee._id ? updatedPayment : f
        )
      );

      alert(`Payment successful via UPI: ${upiId}`);
      setShowUPIModal(false);
      setSelectedFee(null);
      setUpiId('');
    } catch (err) {
      alert('Payment failed: ' + err.message);
    }
  };

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🎵</div>
          <div className="brand-text">
            <div className="brand-title">Latin Dance</div>
            <div className="brand-sub">Academy</div>
          </div>
        </div>
        <nav className="side-nav">
          <SidebarItem label="Dashboard" to="/admin" />
          <SidebarItem label="Classes" to="/admin/classes" />
          <SidebarItem label="Students" to="/admin/students" />
          <SidebarItem label="Waitlist" to="/admin/waitlist" />
          <SidebarItem label="Attendance" to="/admin/attendance" />
          <SidebarItem label="Fees & Payments" to="/admin/fees" />
          <SidebarItem label="Feedback" to="/admin/feedback" />
          <SidebarItem label="Profile" to="/admin/profile" />
        </nav>
        <div className="side-user">
          <div className="user-info">
            <div className="avatar">A</div>
            <div className="user-details">
              <div className="user-name">Admin User</div>
              <div className="user-role">Admin</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="page-header">
          <h1>Fee Management</h1>
          <p>Manage student payments and fees</p>
        </header>

        {/* Summary cards */}
        <section className="stats">
          <div className="stat-card">
            <div className="stat-head"><span>Total Paid</span><CreditCard size={16} className="stat-icon" /></div>
            <div className="stat-value"><strong className="success">${summary.totals.paid?.toFixed ? summary.totals.paid.toFixed(2) : Number(summary.totals.paid || 0).toFixed(2)}</strong><div className="stat-sub">{summary.totals.count?.paid || 0} payments</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-head"><span>Outstanding</span><AlertCircle size={16} className="stat-icon" /></div>
            <div className="stat-value"><strong className="danger">${summary.totals.outstanding?.toFixed ? summary.totals.outstanding.toFixed(2) : Number(summary.totals.outstanding || 0).toFixed(2)}</strong><div className="stat-sub">Pending + Overdue</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-head"><span>Pending</span></div>
            <div className="stat-value"><strong>${Number(summary.totals.pending || 0).toFixed(2)}</strong><div className="stat-sub">{summary.totals.count?.pending || 0} items</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-head"><span>Overdue</span></div>
            <div className="stat-value"><strong>${Number(summary.totals.overdue || 0).toFixed(2)}</strong><div className="stat-sub">{summary.totals.count?.overdue || 0} items</div></div>
          </div>
        </section>

        {(pendingCount > 0 || overdueCount > 0) && (
          <div className="payment-reminder">
            <AlertCircle size={20} />
            <div>
              <div className="reminder-title">Payment Reminders</div>
              <div className="reminder-text">
                You have {pendingCount} pending and {overdueCount} overdue payments.
              </div>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <section className="panel fee-panel">
          <div className="panel-title">Fee Records ({loading ? '...' : fees.length})</div>
          <div className="table-wrapper">
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>Loading payments...</div>
            ) : fees.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>No payment records found.</div>
            ) : (
              <table className="fee-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Month</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((fee) => (
                    <tr key={fee._id}>
                      <td>{fee.student?.name || 'Unknown'}</td>
                      <td>{fee.class?.name || 'Unknown'}</td>
                      <td>{fee.month}</td>
                      <td>${fee.amount}</td>
                      <td><StatusBadge status={fee.status} /></td>
                      <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                      <td>
                        {fee.status === 'Paid' ? (
                          <button
                            className="receipt-btn"
                            onClick={() => generateReceipt(fee)}
                          >
                            <Download size={16} />
                            Receipt
                          </button>
                        ) : (
                          <span className="pill neutral">Awaiting student payment</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {showUPIModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <div>
                  <div className="modal-title">UPI Payment</div>
                  <div className="modal-sub">
                    {selectedFee?.student} - {selectedFee?.class}
                  </div>
                </div>
                <button className="modal-close" onClick={() => setShowUPIModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="payment-details">
                  <div className="detail-row">
                    <span>Amount:</span>
                    <strong>${selectedFee?.amount}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Month:</span>
                    <strong>{selectedFee?.month}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Due Date:</span>
                    <strong>{selectedFee?.dueDate}</strong>
                  </div>
                </div>
                <label className="modal-label">Enter UPI ID</label>
                <input
                  className="modal-input"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                />
                <p className="modal-hint">Enter your UPI ID to complete the payment</p>
              </div>
              <div className="modal-actions">
                <button className="btn ghost" onClick={() => setShowUPIModal(false)}>Cancel</button>
                <button className="btn primary" onClick={handleConfirmPayment}>Confirm Payment</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FeeManagement;
