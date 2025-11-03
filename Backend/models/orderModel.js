import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      name: { type: String, required: true },
      image: [String],
      price: { type: Number, required: true },
      size: String,
      quantity: { type: Number, required: true },
      status: {
        type: String,
        default: 'Order Placed',
        enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled','Returned','Replacement']
      },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } //sellerid
    }
  ],
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  paymentMethod: { type: String, required: true, enum: ['COD', 'Stripe'] },
  payment: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default orderModel;
