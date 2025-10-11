import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Review from "../components/Review";
import Title from "../components/Title";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, token } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  // Fetch product data from context
  const fetchProductData = () => {
    const item = products.find((p) => p._id === productId);
    if (item) {
      setProductData(item);
      setImage(item.image[0]);
      setCreatedBy(item.createdBy || "");
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const handleAddToCart = () => {
    if (!token) {
      toast.error("Please login to add items to your cart.");
      return;
    }
    if (productData.stock <= 0) {
      toast.error("Sorry, this product is out of stock.");
      return;
    }
    if (productData.sizes?.length > 0 && !size) {
      toast.error("Please select a size before adding to cart.");
      return;
    }
    if (productData.colors?.length > 0 && !color) {
      toast.error("Please select a color before adding to cart.");
      return;
    }

    addToCart(productData._id, size, color, createdBy);
    toast.success("Item added to cart!");
  };

  // Show loading or not found
  if (!productData) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-gray-600 text-lg">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen pt-14 px-4 sm:px-8 pb-16">
      {/* Title Section */}
      <div className="text-center text-3xl py-2 text-orange-700 font-bold">
        <Title text1={productData.name} text2={"DETAILS"} />
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />

      {/* Breadcrumb */}
      <div className="text-gray-600 text-sm mb-6">
        <Link to="/" className="hover:text-orange-600">Home</Link> /{" "}
        <Link to={`/category/${productData.category}`} className="hover:text-orange-600">
          {productData.category}
        </Link>{" "}
        / <span className="text-orange-700">{productData.name}</span>
      </div>

      {/* Product Section */}
      <div className="flex flex-col lg:flex-row gap-12 justify-center items-start">
        {/* Image Gallery */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4">
          {/* Thumbnail list */}
          <div className="flex lg:flex-col gap-3 w-full lg:w-[100px] overflow-x-auto lg:overflow-y-auto">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                alt="thumbnail"
                className={`w-24 h-24 object-cover rounded-md cursor-pointer border transition-all duration-300 transform hover:scale-105
                  ${
                    item === image
                      ? "border-2 border-orange-500 shadow-lg scale-110"
                      : "border-gray-300 hover:border-orange-400"
                  }`}
              />
            ))}
          </div>

          {/* Main image */}
          <div className="flex-1 bg-white rounded-xl shadow-md p-4">
            <img
              src={image}
              alt="product"
              className="w-full max-h-[600px] object-contain rounded-lg transition-all duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 bg-white shadow-md p-6 rounded-xl">
          <h1 className="font-semibold text-2xl text-gray-800 mb-2">{productData.name}</h1>

          {/* Price Section */}
          <div className="mt-3 flex items-center gap-3">
            <p className="text-3xl font-medium text-orange-600">
              {currency} {productData.discountPrice || productData.price}
            </p>
            {productData.discountPrice && (
              <p className="text-xl text-gray-500 line-through">
                {currency} {productData.price}
              </p>
            )}
          </div>

          <p className="mt-4 text-gray-600 leading-relaxed md:w-4/5">
            {productData.description}
          </p>

          {/* Extra Info */}
          <div className="mt-6 text-sm text-gray-700 space-y-1">
            <p>
              <b>Material:</b> {productData.material || "N/A"}
            </p>
            <p>
              <b>Region:</b> {productData.region || "N/A"}
            </p>
            <p>
              <b>Shop Name:</b> {productData.artisan}
            </p>
            <p>
              <b>Stock:</b>{" "}
              {productData.stock > 0 ? (
                <span className="text-green-600">{productData.stock} available</span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </p>
            {productData.bestseller && (
              <span className="text-orange-600 font-semibold">★ Bestseller</span>
            )}
          </div>

          {/* Size Selection */}
          {productData.sizes?.length > 0 && (
            <div className="flex flex-col gap-4 my-6">
              <p className="font-medium text-gray-700">Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`border py-2 px-4 rounded-md transition-all duration-200 
                      ${
                        item === size
                          ? "bg-orange-500 text-white border-orange-600"
                          : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {size && (
                <p className="text-sm text-green-600">
                  Selected Size: <b>{size}</b>
                </p>
              )}
            </div>
          )}

          {/* Color Selection */}
          {productData.colors?.length > 0 && (
            <div className="flex flex-col gap-4 my-6">
              <p className="font-medium text-gray-700">Select Color</p>
              <div className="flex gap-3 flex-wrap">
                {productData.colors.map((c, index) => (
                  <button
                    key={index}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 
                      ${
                        c === color
                          ? "border-4 border-orange-500 scale-110"
                          : "border-gray-300 hover:scale-105"
                      }`}
                    style={{ backgroundColor: c.toLowerCase() }}
                  />
                ))}
              </div>
              {color && (
                <p className="text-sm text-green-600">
                  Selected Color: <b>{color}</b>
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              disabled={productData.stock <= 0}
              className={`px-8 py-3 text-sm text-white rounded-lg transition-all duration-200 
                ${
                  productData.stock > 0
                    ? "bg-black hover:bg-gray-800 active:bg-gray-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              onClick={handleAddToCart}
            >
              {productData.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

            {productData.createdBy && (
              <Link to={`/chat/${productData.createdBy}`}>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-all duration-200">
                  Chat with Seller
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-16 bg-white shadow-md p-8 rounded-xl">
        <Review productId={productId} token={token} />
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  );
};

export default Product;
