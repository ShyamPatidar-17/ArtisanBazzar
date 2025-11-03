import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

// ✅ Helper: remove duplicates
const uniq = (arr) => Array.from(new Set(arr.map(String))).map((id) => id);

// ✅ Fetch user's recently ordered products
async function getRecentProducts(userId, N = 5) {
  const orders = await orderModel.find({ userId }).sort({ date: -1 }).limit(10);
  if (!orders.length) return [];

  const productNames = [];
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.name) productNames.push(item.name);
    });
  });

  const products = await productModel.find({ name: { $in: productNames } }).limit(N);
  return products;
}

// ✅ Recommend products from same category or subcategory
async function categoryBasedRecommendations(userId) {
  const recentProducts = await getRecentProducts(userId, 5);
  if (!recentProducts.length) return [];

  const categories = uniq(recentProducts.map((p) => p.category));
  const subcategories = uniq(recentProducts.map((p) => p.subCategory));

  return await productModel.find({
    $or: [{ category: { $in: categories } }, { subCategory: { $in: subcategories } }],
  }).limit(10);
}

// ✅ Recommend products where quantity purchased > 4
async function highQuantityRecommendations(userId) {
  const orders = await orderModel.find({ userId });
  if (!orders.length) return [];

  const productCounts = {};

  for (const order of orders) {
    for (const item of order.items) {
      if (!item.name) continue;
      productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
    }
  }

  // Filter for items with total purchased quantity > 4
  const frequentProducts = Object.keys(productCounts).filter(
    (name) => productCounts[name] > 4
  );

  if (!frequentProducts.length) return [];

  const products = await productModel.find({ name: { $in: frequentProducts } }).limit(10);
  return products;
}

// ✅ Main Recommendation Controller
export async function getRecommendationsForUser(req, res) {
  try {
    const { userId } = req.params;
    console.log("🧠 Generating recommendations for:", userId);

    // Fetch both types of recommendations
    const [categoryRecs, highQtyRecs] = await Promise.all([
      categoryBasedRecommendations(userId),
      highQuantityRecommendations(userId),
    ]);

    // Combine and remove duplicates
    const allRecs = uniq([
      ...categoryRecs.map((p) => p._id.toString()),
      ...highQtyRecs.map((p) => p._id.toString()),
    ]);

    const recommendations = await productModel.find({ _id: { $in: allRecs } }).limit(12);

    // Fallback to latest products if no recommendations found
    if (!recommendations.length) {
      console.log("⚙️ No specific recommendations — returning latest products");
      const fallback = await productModel.find().sort({ createdAt: -1 }).limit(8);
      return res.json(fallback);
    }

    console.log(`✅ ${recommendations.length} recommendations generated`);
    res.json(recommendations);
  } catch (err) {
    console.error("❌ Recommendation Error:", err);
    res
      .status(500)
      .json({ message: "Error generating recommendations", error: err.message });
  }
}
