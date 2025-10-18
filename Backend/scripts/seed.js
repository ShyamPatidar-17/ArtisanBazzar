require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/artisan_reco');
  console.log('Connected');

  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});

  const users = await User.create([
    { name: 'Shyam', email: 'shyam@example.com' },
    { name: 'Asha', email: 'asha@example.com' },
    { name: 'Ravi', email: 'ravi@example.com' }
  ]);

  const products = await Product.create([
    { name: 'Clay Pot Small', category: 'Pottery', tags: ['pottery','home','handmade'], price: 300 },
    { name: 'Clay Pot Large', category: 'Pottery', tags: ['pottery','decor','handmade'], price: 700 },
    { name: 'Handwoven Basket', category: 'Baskets', tags: ['basket','handmade','storage'], price: 250 },
    { name: 'Braided Rug', category: 'Textiles', tags: ['rug','handmade','home'], price: 1200 },
    { name: 'Wooden Spoon Set', category: 'Kitchen', tags: ['kitchen','wood','handmade'], price: 150 },
    { name: 'Terracotta Planter', category: 'Pottery', tags: ['plant','pottery','outdoor'], price: 450 }
  ]);

  await Order.create([
    { userId: users[0]._id, products: [ { productId: products[0]._id, qty: 1, price: 300 }, { productId: products[2]._id, qty:1, price:250 } ] },
    { userId: users[1]._id, products: [ { productId: products[0]._id, qty: 1, price:300 }, { productId: products[1]._id, qty:1, price:700 } ] },
    { userId: users[2]._id, products: [ { productId: products[3]._id, qty: 1, price:1200 }, { productId: products[4]._id, qty:1, price:150 } ] },
    { userId: users[0]._id, products: [ { productId: products[5]._id, qty: 1, price:450 } ] }
  ]);

  console.log('Seed complete');
  console.log('Example user id (Shyam):', users[0]._id.toString());
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
