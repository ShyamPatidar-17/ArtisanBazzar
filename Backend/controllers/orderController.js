// import { currency } from "../../Admin/src/App.jsx"
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import { Stripe } from 'stripe'

const currency = 'inr'
const deliveryCharges = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//Cod
const placeOrderCOD = async (req, res) => {

  try {
    const { userId, items, amount, address } = req.body

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    }

    const newOrder = new orderModel(orderData)

    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} })

    res.json({ success: true, message: "Order Placed" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

//Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map(item => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment'
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.log("Stripe Error:", error);
    res.json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === 'true') {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log("Stripe Error:", error);
    res.json({ success: false, message: error.message });
  }
};

//Admin Panel
const allOrders = async (req, res) => {


  try {
    const orders = await orderModel.find({})
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

//frontendd
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body

    const orders = await orderModel.find({ userId })
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


//Update Order Status (Frontend)
const updateStatusUser = async (req, res) => {
  const { orderId, itemIndex, status } = req.body;

  try {
    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    if (!order.items[itemIndex]) {
      return res.json({ success: false, message: "Invalid item index" });
    }

    order.items[itemIndex].status = status;
    await order.save();

    res.json({ success: true, message: "Item status updated", order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


//update Order Status (Admin Panel)
const updateStatusAdmin = async (req, res) => {
  const { orderId, itemIndex, status } = req.body;

  try {
    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    if (!order.items[itemIndex]) {
      return res.json({ success: false, message: "Invalid item index" });
    }

    order.items[itemIndex].status = status;
    await order.save();

    res.json({ success: true, message: "Item status updated", order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};




export { placeOrderCOD, placeOrderStripe, allOrders, userOrders, updateStatusUser, updateStatusAdmin,verifyStripe }
