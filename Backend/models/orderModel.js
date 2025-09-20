import mongoose, { Schema } from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      name: String,
      image: [String],
      price: Number,
      size: String,
      quantity: Number,
      status: {
        type: String,
        default: 'Order Placed',
        enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
      }
    }
  ],
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  date: { type: Number, required: true }
});


const orderModel=mongoose.models.order || mongoose.model('order',orderSchema)


export default orderModel;