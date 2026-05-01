const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  phone: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  checkoutRequestID: { type: String, index: true, unique: true, sparse: true },
  merchantRequestID: String,
  responseBody: { type: mongoose.Schema.Types.Mixed },
  callbackPayload: { type: mongoose.Schema.Types.Mixed },
  resultCode: Number,
  resultDesc: String,
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
