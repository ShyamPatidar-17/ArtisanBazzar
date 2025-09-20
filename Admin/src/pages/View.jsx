import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("sellerToken");
        if (!token) {
          toast.error("You are not logged in!");
          navigate("/seller");
          return;
        }

        const res = await axios.get(`${backendUrl}/api/products/single/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setProduct(res.data.product);
        } else {
          toast.error(res.data.message || "Failed to load product");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // ✅ Remove product function
  const removeProduct = async (productId) => {
    try {
      const token = localStorage.getItem("sellerToken");
      if (!token) {
        toast.error("You are not logged in!");
        navigate("/seller");
        return;
      }

      const res = await axios.post(
        `${backendUrl}/api/products/remove`,
        { id: productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Product removed successfully!");
        navigate("/list"); // back to list after delete
      } else {
        toast.error(res.data.message || "Failed to remove product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing product");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center mt-10">Product not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-orange-50 rounded-lg shadow-md mt-8">
      <button
        onClick={() => navigate("/list")}
        className="mb-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        ← Back to List
      </button>

      {/* Title */}
      <h2 className="text-3xl font-bold text-orange-800 mb-6">{product.name}</h2>

      {/* Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {product.image && product.image.length > 0 ? (
          product.image.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`product-${i}`}
              className="w-full h-40 object-cover rounded border-2 border-orange-300"
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="mb-2">
            <strong>Price:</strong> {currency} {product.price}
          </p>
          {product.discountPrice && (
            <p className="mb-2">
              <strong>Discount Price:</strong> {currency} {product.discountPrice}
            </p>
          )}
          <p className="mb-2">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="mb-2">
            <strong>Sub-Category:</strong> {product.subCategory}
          </p>
          <p className="mb-2">
            <strong>Material:</strong> {product.material || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Region:</strong> {product.region || "N/A"}
          </p>
        </div>

        <div>
          <p className="mb-2">
            <strong>Sizes:</strong>{" "}
            {product.sizes && product.sizes.length > 0
              ? product.sizes.join(", ")
              : "N/A"}
          </p>
          <p className="mb-2">
            <strong>Colors:</strong>{" "}
            {product.colors && product.colors.length > 0
              ? product.colors.join(", ")
              : "N/A"}
          </p>
          <p className="mb-2">
            <strong>Stock:</strong> {product.stock ?? "N/A"}
          </p>
          <p className="mb-2">
            <strong>Artisan:</strong> {product.artisan || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Featured:</strong> {product.featured ? "Yes" : "No"}
          </p>
          <p className="mb-2">
            <strong>Bestseller:</strong> {product.bestseller ? "Yes" : "No"}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <p className="mb-1 font-semibold text-orange-800">Description:</p>
        <p className="text-gray-700">{product.description}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-2 flex-wrap mt-6">
        <button
          onClick={() => navigate(`/edit/${product._id}`)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => removeProduct(product._id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ViewProduct;
