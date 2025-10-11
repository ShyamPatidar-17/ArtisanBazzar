import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import SearchBar from "../components/SearchBar";

const Collection = () => {
  const { products, search, currency } = useContext(ShopContext);

  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortType, setSortType] = useState("relevant");
  const [showFilterModal, setShowFilterModal] = useState(false);

  // ✅ Toggle category
  const toggleCategory = (value) =>
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  // ✅ Toggle sub-category
  const toggleSubCategory = (value) =>
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  // ✅ Apply filters including search
  const applyFilter = () => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      filtered = filtered.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    if (priceRange) {
      filtered = filtered.filter(
        (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
      );
    }

    // Sort before setting
    switch (sortType) {
      case "low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilterProducts(filtered);
  };

  // ✅ Run filters whenever dependencies change
  useEffect(() => {
    applyFilter();
  }, [search, category, subCategory, priceRange, sortType, products]);

  // ✅ Clear filters
  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setPriceRange([0, 5000]);
    setSortType("relevant");
  };

  return (
    <div className="bg-amber-50 min-h-screen pt-14 px-4 sm:px-8">
      <div className="text-3xl sm:text-4xl mb-6 text-center text-red-900">
        <Title text1="OUR" text2="COLLECTION" />
      </div>

      <SearchBar alwaysVisible />
      
      <div className="flex justify-end mb-6 mt-5">
        <button
          onClick={() => setShowFilterModal(true)}
          className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 shadow-md"
        >
          FILTERS & SORT
        </button>
      </div>

     {/* Products Grid */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
  {filterProducts.length > 0 ? (
    filterProducts.map((item) => (
      <div
        key={item._id}
        className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:scale-105 transition-transform duration-300 overflow-hidden relative"
      >
        {/* Product Item */}
        <ProductItem
          key={item._id}
          id={item._id}
          name={item.name}
          image={item.image}
          price={item.price}
          discountPrice={item.discountPrice}
          bestseller={item.bestseller}
          currency={currency}
          createdBy={item.createdBy}
        />

        {/* Prices */}
        <div className="p-3 flex flex-col items-center text-center">
          {item.discountPrice ? (
            <div className="flex gap-2 items-center">
              <span className="text-red-600 font-semibold text-lg">
                {currency} {item.discountPrice}
              </span>
              <span className="text-gray-400 line-through text-sm">
                {currency} {item.price}
              </span>
            </div>
          ) : (
            <span className="text-red-600 font-semibold text-lg">
              {currency} {item.price}
              
            </span>
          )}

          {/* Add to Cart Button */}
         
        </div>

        {/* Bestseller Badge */}
        {item.bestseller && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-red-800 text-xs font-bold px-2 py-0.5 rounded-md shadow-md">
            Bestseller
          </span>
        )}
      </div>
    ))
  ) : (
    <p className="text-center text-red-900 col-span-full py-10">
      No products found.
    </p>
  )}
</div>


      {/* Filter & Sort Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="bg-white w-80 sm:w-96 h-full p-6 overflow-y-auto shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-red-800">Filters & Sort</h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-red-800 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* CATEGORY */}
            <div className="mb-4">
              <p className="mb-2 font-medium text-sm text-red-800">CATEGORY</p>
              <div className="flex flex-col gap-2 text-sm text-gray-700">
                {["Pottery", "Handloom", "Jewelry", "Woodcraft"].map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 cursor-pointer hover:text-red-900"
                  >
                    <input
                      type="checkbox"
                      checked={category.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 accent-red-500"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* SUBCATEGORY */}
            <div className="mb-4">
              <p className="mb-2 font-medium text-sm text-red-800">TYPE</p>
              <div className="flex flex-col gap-2 text-sm text-gray-700">
                {["Terracotta", "Saree", "Brass", "Cotton", "Silk", "Wood"].map(
                  (sub) => (
                    <label
                      key={sub}
                      className="flex items-center gap-2 cursor-pointer hover:text-red-900"
                    >
                      <input
                        type="checkbox"
                        checked={subCategory.includes(sub)}
                        onChange={() => toggleSubCategory(sub)}
                        className="w-4 h-4 accent-red-500"
                      />
                      {sub}
                    </label>
                  )
                )}
              </div>
            </div>

            {/* PRICE RANGE */}
            <div className="mb-4">
              <p className="mb-2 font-medium text-sm text-red-800">PRICE</p>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  placeholder="Min"
                  className="border px-2 py-1 w-20 rounded"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  placeholder="Max"
                  className="border px-2 py-1 w-20 rounded"
                />
              </div>
            </div>

            {/* SORT */}
            <div className="mb-6">
              <p className="mb-2 font-medium text-sm text-red-800">SORT BY</p>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="border w-full px-2 py-1 rounded"
              >
                <option value="relevant">Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

            {/* ✅ Action buttons */}
            <div className="mt-auto flex gap-3">
              <button
                onClick={() => {
                  clearFilters();
                  setShowFilterModal(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Clear Filters
              </button>

              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
