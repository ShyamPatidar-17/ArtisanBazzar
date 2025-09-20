// frontend/components/List.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const List = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/products/list`);
      if (response.data.success) {
        setList(response.data.products || []);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="w-full px-4">
      <p className="text-xl font-semibold mb-4">All Products</p>

      {list.length === 0 && <p>No products found</p>}

      {list.map((item) => (
        <div key={item._id} className="flex items-center gap-4 border-b py-3">
          <img
            src={item.image?.[0] || "/fallback-image.png"} // ✅ Cloudinary URL
            alt={item.name}
            className="w-16 h-16 object-cover rounded-md border"
          />
          <div className="flex-1">
            <p className="font-medium">{item.name}</p>
            <p>{currency}{item.price}</p>
          </div>
          <button
            onClick={() => navigate(`/view/${item._id}`)}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
};

export default List;
