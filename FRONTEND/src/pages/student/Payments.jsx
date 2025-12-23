import React, { useEffect, useState } from 'react';
import { Download, DollarSign, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { paymentAPI } from '../../utils/api.js';
import StudentSidebar from '../../components/StudentSidebar.jsx';
import './StudentDashboard.css';

const Payments = () => {
  const studentId = localStorage.getItem('userId');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payModal, setPayModal] = useState({
    open: false,
    payment: null,
    method: 'UPI',
    // dynamic fields per method
    upiId: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    rememberCard: false,
    bankRef: '',
    reference: '' // generic fallback
  });


  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentsData = await paymentAPI.getStudentPayments(studentId);
        setPayments(paymentsData);
      } catch (err) {
        setError(err.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchPayments();
    }
  }, [studentId]);

  const openPayModal = (payment) => {
    setPayModal({
      open: true,
      payment,
      method: 'UPI',
      upiId: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      rememberCard: false,
      bankRef: '',
      reference: ''
    });
  };

  const closePayModal = () => {
    setPayModal({
      open: false,
      payment: null,
      method: 'UPI',
      upiId: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      rememberCard: false,
      bankRef: '',
      reference: ''
    });
  };

  const handleConfirmPayment = async () => {
    if (!payModal.payment) return;

    const { method, upiId, cardName, cardNumber, cardExpiry, cardCvc, bankRef, reference, payment } = payModal;

    let transactionId = '';

    // Basic validation per method
    if (method === 'UPI') {
      if (!upiId.trim()) {
        alert('Please enter your UPI ID');
        return;
      }
      transactionId = upiId.trim();
    } else if (method === 'Card') {
      if (!cardName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim()) {
        alert('Please complete card details');
        return;
      }
      transactionId = `CARD-${cardNumber.slice(-4)}-${Date.now()}`;
    } else if (method === 'Bank Transfer') {
      if (!bankRef.trim()) {
        alert('Please enter bank transfer reference/UTR');
        return;
      }
      transactionId = bankRef.trim();
    } else {
      transactionId = reference.trim() || `TXN${Date.now()}`;
    }

    try {
      await paymentAPI.update(payment._id, {
        status: 'Paid',
        paidDate: new Date().toISOString(),
        transactionId,
        paymentMethod: method,
      });

      const paymentsData = await paymentAPI.getStudentPayments(studentId);
      setPayments(paymentsData);
      closePayModal();
      alert('Payment successful! ✅');
    } catch (err) {
      alert('Payment failed: ' + err.message);
    }
  };

  const handleReceipt = (payment) => {
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
    doc.text(`Student Name: ${payment.student?.name || 'Unknown'}`, 20, 70);
    doc.text(`Class: ${payment.class?.name || 'Unknown'}`, 20, 80);
    doc.text(`Month: ${payment.month}`, 20, 90);
    doc.text(`Amount: $${payment.amount}`, 20, 100);
    doc.text(`Due Date: ${new Date(payment.dueDate).toLocaleDateString()}`, 20, 110);
    doc.text(`Payment Date: ${payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : 'N/A'}`, 20, 120);
    doc.text(`Status: ${payment.status}`, 20, 130);
    doc.text(`Transaction ID: ${payment.transactionId || 'N/A'}`, 20, 140);
    
    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your payment!', 105, 160, { align: 'center' });
    doc.text('Latin Dance Academy - Making Dance Dreams Come True', 105, 170, { align: 'center' });
    
    // Save
    const studentName = payment.student?.name || 'Student';
    doc.save(`Receipt_${studentName.replace(/\s+/g, '_')}_${payment.month.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="payments-page-shell">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="student-content">
        <header className="page-header">
          <h1>Fee Management</h1>
          <p>View and pay your class fees</p>
        </header>

        <section className="classes-section">
          <h2 className="section-heading">Fee Records</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="classes-table-wrapper">
            <table className="classes-table">
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
                {loading ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Loading payments...</td></tr>
                ) : payments.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No payments found</td></tr>
                ) : payments.map((item) => (
                  <tr key={item._id}>
                    <td>{item.student?.name || 'N/A'}</td>
                    <td>{item.class?.name || 'N/A'}</td>
                    <td>{item.month}</td>
                    <td>${item.amount}</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      {item.status === 'Paid' ? (
                        <button
                          className="receipt-btn"
                          onClick={() => handleReceipt(item)}
                        >
                          <Download size={16} />
                          Receipt
                        </button>
                      ) : item.status === 'Pending' ? (
                        <button
                          className="pay-btn"
                          onClick={() => openPayModal(item)}
                        >
                          <DollarSign size={16} />
                          Pay Now
                        </button>
                      ) : (
                        <span className="no-action">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {payModal.open && (
        <div className="payment-overlay">
          <div className="payment-card">
            <button className="close-x" onClick={closePayModal} aria-label="Close">
              <X size={16} />
            </button>
            <div className="payment-layout">
              {/* Summary (Left) */}
              <div className="payment-summary">
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontWeight: 700, color: '#1f2937', margin: '0 0 8px 0', fontSize: 18 }}>Invoice</h3>
                  <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>
                    Payment receipt will be generated upon successful transaction
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #ecebff' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1f2937' }}>{payModal.payment?.class?.name || 'Class Fee'}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Month: {payModal.payment?.month}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#1f2937' }}>${payModal.payment?.amount?.toFixed ? payModal.payment?.amount?.toFixed(2) : payModal.payment?.amount}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#6b7280' }}>
                  <div style={{ fontSize: 13 }}>Tax</div>
                  <div style={{ fontSize: 13 }}>$0.00</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #ecebff', marginTop: 8 }}>
                  <div style={{ fontWeight: 800, color: '#1f2937' }}>Total</div>
                  <div style={{ fontWeight: 900, color: '#d4a574' }}>${payModal.payment?.amount?.toFixed ? payModal.payment?.amount?.toFixed(2) : payModal.payment?.amount}</div>
                </div>
              </div>

              {/* Form (Right) */}
              <div className="payment-form">
                <div className="pay-header" style={{ textAlign: 'left', marginBottom: 16 }}>
                  <h3 style={{ marginBottom: 8 }}>Payment</h3>
                </div>

                {/* Method Tabs */}
                <div className="method-tabs">
                  {['Card', 'Bank Transfer', 'UPI'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setPayModal((prev) => ({ ...prev, method: m }))}
                      className={`tab ${payModal.method === m ? 'active' : ''}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Dynamic Fields */}
                {payModal.method === 'UPI' && (
                  <div className="pay-input">
                    <label style={{ fontSize: 12, opacity: 0.8 }}>UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={payModal.upiId}
                      onChange={(e) => setPayModal((p) => ({ ...p, upiId: e.target.value }))}
                    />
                  </div>
                )}

                {payModal.method === 'Card' && (
                  <>
                    <div className="pay-input">
                      <label style={{ fontSize: 12, opacity: 0.8 }}>Cardholder's Name</label>
                      <input
                        type="text"
                        placeholder="Name on card"
                        value={payModal.cardName}
                        onChange={(e) => setPayModal((p) => ({ ...p, cardName: e.target.value }))}
                      />
                    </div>
                    <div className="pay-input">
                      <label style={{ fontSize: 12, opacity: 0.8 }}>Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={payModal.cardNumber}
                        onChange={(e) => setPayModal((p) => ({ ...p, cardNumber: e.target.value }))}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div className="pay-input" style={{ flex: 1 }}>
                        <label style={{ fontSize: 12, opacity: 0.8 }}>Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={payModal.cardExpiry}
                          onChange={(e) => setPayModal((p) => ({ ...p, cardExpiry: e.target.value }))}
                        />
                      </div>
                      <div className="pay-input" style={{ flex: 1 }}>
                        <label style={{ fontSize: 12, opacity: 0.8 }}>CVC</label>
                        <input
                          type="password"
                          placeholder="123"
                          value={payModal.cardCvc}
                          onChange={(e) => setPayModal((p) => ({ ...p, cardCvc: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <input
                        id="rememberCard"
                        type="checkbox"
                        checked={payModal.rememberCard}
                        onChange={(e) => setPayModal((p) => ({ ...p, rememberCard: e.target.checked }))}
                      />
                      <label htmlFor="rememberCard" style={{ fontSize: 12, opacity: 0.8 }}>Remember bank card</label>
                    </div>
                  </>
                )}

                {payModal.method === 'Bank Transfer' && (
                  <div className="pay-input">
                    <label style={{ fontSize: 12, opacity: 0.8 }}>Reference / UTR</label>
                    <input
                      type="text"
                      placeholder="UTR / Reference Number"
                      value={payModal.bankRef}
                      onChange={(e) => setPayModal((p) => ({ ...p, bankRef: e.target.value }))}
                    />
                  </div>
                )}

                {(payModal.method === 'Cash on Delivery' || payModal.method === 'Cash') && (
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
                    You will pay in cash. No additional details required.
                  </div>
                )}

                {/* Fallback generic reference for other methods */}
                {['Other'].includes(payModal.method) && (
                  <div className="pay-input">
                    <label style={{ fontSize: 12, opacity: 0.8 }}>Reference (optional)</label>
                    <input
                      type="text"
                      placeholder="Transaction reference"
                      value={payModal.reference}
                      onChange={(e) => setPayModal((p) => ({ ...p, reference: e.target.value }))}
                    />
                  </div>
                )}

                <div className="pay-actions" style={{ marginTop: 16 }}>
                  <button className="pay-btn" onClick={handleConfirmPayment} style={{ width: '100%' }}>
                    Pay Now
                  </button>
                </div>
                <div style={{ marginTop: 10, textAlign: 'center' }}>
                  <button className="receipt-btn" onClick={closePayModal}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Payments;
