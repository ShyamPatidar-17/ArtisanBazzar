import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

export async function getRecommendationsForUser(req, res) {
  try {
    const { userId } = req.params;
    console.log("Generating recommendations for user:", userId);

    const orders = await orderModel.find({ userId });
    console.log("USER ORDERS:", orders);

    if (!orders || orders.length === 0) {
      console.log("No orders found — returning latest products");
      const fallback = await productModel.find().sort({ createdAt: -1 }).limit(8);
      return res.json(fallback);
    }

    
    const productCount = {};
    for (const order of orders) {
      if (!order.items) continue;
      for (const item of order.items) {
        const name = item.name?.trim().toLowerCase();
        if (!name) continue;
        productCount[name] = (productCount[name] || 0) + (item.quantity || 1);
      }
    }

    console.log("Product purchase count:", productCount);

    const frequentNames = Object.keys(productCount).filter(
      (name) => productCount[name] > 5 
    );

    console.log("Frequent product names:", frequentNames);

    let recommendations = [];

    if (frequentNames.length > 0) {
      recommendations = await productModel.find({
        name: { $in: frequentNames.map(n => new RegExp(`^${n}$`, "i")) },
      });
    }

    console.log("Recommendations found:", recommendations.length);
    for (const rec of recommendations) {
      console.log("→", rec.name);
    }

    if (!recommendations || recommendations.length === 0) {
      console.log("No frequent items — returning latest products");
      recommendations = await productModel.find().sort({ createdAt: -1 }).limit(8);
    }

    res.json(recommendations);
  } catch (err) {
    console.error("Error generating recommendations:", err);
    res.status(500).json({
      message: "Error generating recommendations",
      error: err.message,
    });
  }
}
