import Payment from '../models/Payment.js';

export const getStudentPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.params.studentId }).populate('student', 'name email').populate('class', 'name style');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('student', 'name email').populate('class', 'name style');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { student, class: classId, amount, month, dueDate, paymentMethod, transactionId, notes } = req.body;
    const payment = new Payment({ student, class: classId, amount, month, dueDate, paymentMethod, transactionId, notes });
    await payment.save();
    const populatedPayment = await payment.populate('student', 'name email').populate('class', 'name style');
    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { status, paidDate, transactionId, paymentMethod, notes } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.paymentId,
      { status, paidDate, transactionId, paymentMethod, notes },
      { new: true, runValidators: true }
    )
      .populate('student', 'name email')
      .populate('class', 'name style');
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Payments summary with totals and monthly revenue
export const getPaymentsSummary = async (req, res) => {
  try {
    // Totals by status and total paid amount
    const totalsByStatus = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          amount: { $sum: { $ifNull: ['$amount', 0] } },
        },
      },
    ]);

    const totals = {
      paid: 0,
      pending: 0,
      overdue: 0,
      cancelled: 0,
      outstanding: 0,
      count: { paid: 0, pending: 0, overdue: 0, cancelled: 0 },
    };

    for (const row of totalsByStatus) {
      const key = (row._id || '').toLowerCase();
      if (key === 'paid') {
        totals.paid = row.amount || 0;
        totals.count.paid = row.count || 0;
      } else if (key === 'pending') {
        totals.pending = row.amount || 0;
        totals.count.pending = row.count || 0;
      } else if (key === 'overdue') {
        totals.overdue = row.amount || 0;
        totals.count.overdue = row.count || 0;
      } else if (key === 'cancelled') {
        totals.cancelled = row.amount || 0;
        totals.count.cancelled = row.count || 0;
      }
    }
    totals.outstanding = (totals.pending || 0) + (totals.overdue || 0);

    // Monthly revenue for last 12 months (based on paidDate if present, else createdAt)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthly = await Payment.aggregate([
      {
        $match: { status: 'Paid', $or: [ { paidDate: { $ne: null } }, { createdAt: { $ne: null } } ] },
      },
      {
        $addFields: {
          paidOrCreated: { $ifNull: ['$paidDate', '$createdAt'] },
        },
      },
      {
        $match: { paidOrCreated: { $gte: twelveMonthsAgo } },
      },
      {
        $group: {
          _id: { year: { $year: '$paidOrCreated' }, month: { $month: '$paidOrCreated' } },
          total: { $sum: { $ifNull: ['$amount', 0] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthlyRevenue = monthly.map((m) => ({
      year: m._id.year,
      month: m._id.month,
      total: m.total,
    }));

    res.json({ totals, monthlyRevenue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
