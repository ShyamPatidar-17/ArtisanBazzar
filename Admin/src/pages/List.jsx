import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


import { backendUrl, currency } from "../App";

const token=localStorage.getItem("sellerToken") || "";
console.log(token)

const List = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const fetchList = async () => {
    try {
      console.log("My tpke:",token);
      const response = await axios.get(`${backendUrl}/api/products/my-products`, {
        headers: { Authorization: `Bearer ${token}` }, // token now exists
      });

      if (response.data.success) {
        setList(response.data.products || []);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
     console.log("My :",token);
    if (token) fetchList(); // ✅ only fetch if token exists
  }, [token]);

  return (
    <div className="w-full px-4">
      <p className="text-xl font-semibold mb-4">All Products</p>
      {list.length === 0 && <p>No products found</p>}
      {list.map((item) => (
        <div key={item._id} className="flex items-center gap-4 border-b py-3">
          <img
            src={item.image?.[0] || "/fallback-image.png"}
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
