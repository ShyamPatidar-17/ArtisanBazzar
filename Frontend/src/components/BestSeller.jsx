import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import Title from './Title';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const best = products.filter((item) => item.bestseller);
    setBestSeller(best.slice(0, 5));
  }, [products]);

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <Title text1="BEST" text2="SELLERS" />
        <p className="text-gray-600 mt-2">
          Popular items loved by our community — handmade & authentic.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {bestSeller.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
            badge="BESTSELLER"
          />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
