import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { assets } from "../assets/assets";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortType, setSortType] = useState("relevant");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const toggleCategory = (value) =>
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const toggleSubCategory = (value) =>
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const applyFilter = () => {
    let filtered = [...products];

    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      filtered = filtered.filter((item) => subCategory.includes(item.subCategory));
    }

    if (priceRange) {
      filtered = filtered.filter(
        (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
      );
    }

    setFilterProducts(filtered);
  };

  const sortProducts = () => {
    let sorted = [...filterProducts];
    switch (sortType) {
      case "low-high":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        applyFilter();
        break;
    }
    setFilterProducts(sorted);
  };

  useEffect(() => applyFilter(), [category, subCategory, priceRange, search, showSearch, products]);
  useEffect(() => sortProducts(), [sortType]);

  return (
    <div className="bg-amber-50 min-h-screen px-4 sm:px-8 py-10">
      {/* Filters & Sort Button */}
      <div className="flex justify-between items-center mb-6">
        <Title text1={"ALL"} text2={"COLLECTIONS"} />
        <button
          onClick={() => setShowFilterModal(true)}
          className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 shadow-md"
        >
          FILTERS & SORT
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filterProducts.length > 0 ? (
          filterProducts.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform"
            >
              <ProductItem id={item._id} name={item.name} price={item.price} image={item.image} />
            </div>
          ))
        ) : (
          <p className="text-center text-red-900 col-span-full py-10">No products found.</p>
        )}
      </div>

      {/* Filter & Sort Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="bg-white w-80 sm:w-96 h-full p-6 overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-red-800">Filters & Sort</h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-red-800 font-bold text-lg"
              >
                X
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
                      value={cat}
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
                {["Terracotta", "Saree", "Brass", "Cotton", "Silk", "Wood"].map((sub) => (
                  <label
                    key={sub}
                    className="flex items-center gap-2 cursor-pointer hover:text-red-900"
                  >
                    <input
                      type="checkbox"
                      value={sub}
                      onChange={() => toggleSubCategory(sub)}
                      className="w-4 h-4 accent-red-500"
                    />
                    {sub}
                  </label>
                ))}
              </div>
            </div>

            {/* PRICE RANGE */}
            <div className="mb-4">
              <p className="mb-2 font-medium text-sm text-red-800">PRICE</p>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  placeholder="Min"
                  className="border px-2 py-1 w-20 rounded"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
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

            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full py-2 bg-red-800 text-white font-semibold rounded hover:bg-red-900"
            >
              APPLY FILTERS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
