import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    required: true
  },
  status: {
    type: String,
    enum: ['inactive', 'active', 'cancelled'],
    default: 'inactive'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  paymentHistory: [{
    amount: Number,
    date: Date,
    transactionId: String
  }]
}, {
  timestamps: true
});

const Subscription = mongoose.model("subscription", subscriptionSchema);
export default Subscription;
