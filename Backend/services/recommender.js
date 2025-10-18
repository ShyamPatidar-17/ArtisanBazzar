// backend/services/recommender.js
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

const uniq = (arr) => Array.from(new Set(arr.map(String))).map(id => id);

async function getRecentProductIdsForUser(userId, N = 5) {
  const orders = await orderModel.find({ userId }).sort({ date: -1 }).limit(10);
  const prodIds = orders.flatMap(o => o.items.map(p => p._id || p.productId)).filter(Boolean);
  return uniq(prodIds).slice(0, N);
}

async function contentBasedRecommendations(recentProductIds, excludeIds = [], limit = 8) {
  if (!recentProductIds || recentProductIds.length === 0) return [];
  const recent = await productModel.find({ _id: { $in: recentProductIds } });
  const tags = uniq(recent.flatMap(r => r.tags || []));
  const categories = uniq(recent.map(r => r.category).filter(Boolean));

  const query = {
    _id: { $nin: [...excludeIds, ...recentProductIds] },
    $or: [
      { tags: { $in: tags } },
      { category: { $in: categories } }
    ]
  };
  const results = await productModel.find(query).limit(limit);
  return results.map(p => ({ product: p, score: 1 }));
}

async function copurchaseRecommendations(recentProductIds, excludeIds = [], limit = 8) {
  if (!recentProductIds || recentProductIds.length === 0) return [];
  const orders = await orderModel.find({ 'items._id': { $in: recentProductIds } });

  const counts = {};
  orders.forEach(o => {
    o.items.forEach(p => {
      const id = String(p._id);
      if (recentProductIds.map(String).includes(id)) return;
      if (excludeIds.map(String).includes(id)) return;
      counts[id] = (counts[id] || 0) + 1;
    });
  });

  const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, limit);
  const productIds = sorted.map(s => s[0]);
  const products = await productModel.find({ _id: { $in: productIds } });

  const productsMap = products.reduce((acc, p) => { acc[String(p._id)] = p; return acc; }, {});
  return sorted.map(([id, cnt]) => ({ product: productsMap[id], score: cnt }));
}

export default async function getRecommendationsForUser(userId, opts = {}) {
  const { limit = 12, excludeIds = [] } = opts;
  const recent = await getRecentProductIdsForUser(userId, 5);
  const cb = await contentBasedRecommendations(recent, excludeIds, 8);
  const co = await copurchaseRecommendations(recent, excludeIds, 8);

  const scores = new Map();
  cb.forEach(item => {
    const id = String(item.product._id);
    const prev = scores.get(id) || { product: item.product, score: 0 };
    prev.score += item.score * 1.0;
    scores.set(id, prev);
  });
  co.forEach(item => {
    const id = String(item.product._id);
    const prev = scores.get(id) || { product: item.product, score: 0 };
    prev.score += item.score * 0.8;
    scores.set(id, prev);
  });

  const arr = Array.from(scores.values())
    .filter(x => x.product)
    .sort((a,b) => b.score - a.score)
    .slice(0, limit);

  return arr.map(a => ({ product: a.product, score: a.score }));
}
