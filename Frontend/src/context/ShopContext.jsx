// ShopContext.jsx
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

export default function ShopContextProvider(props) {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // ✅ Add to cart
  const addToCart = (id, size, color) => {
  setCartItems((prev) => {
    const key = `${size || "default"}-${color || "default"}`;
    const newCart = { ...prev };

    if (!newCart[id]) {
      newCart[id] = {};
    }

    if (!newCart[id][key]) {
      newCart[id][key] = 0;
    }

    newCart[id][key] += 1;

    return newCart;
  });
};


  // ✅ Cart count
  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += cartItems[itemId][size] || 0;
      }
    }
    return totalCount;
  };

  // ✅ Update cart qty
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // ✅ Cart total
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((p) => p._id === itemId);
      if (itemInfo) {
        for (const size in cartItems[itemId]) {
          totalAmount += itemInfo.price * cartItems[itemId][size];
        }
      }
    }
    return totalAmount;
  };

  // ✅ Fetch products
  const getProductData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/products/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      toast.error("Error fetching products");
      console.error("Fetch Products Error:", error);
    }
  };

  // ✅ Fetch user cart
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ✅ Restore token from localStorage
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
    getProductData();
  }, []);

  // ✅ Whenever token changes, refresh cart
  useEffect(() => {
    if (token) {
      getUserCart(token);
    } else {
      setCartItems({});
    }
  }, [token]);

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    toast.success("Logged out successfully");
    navigate("/");
  };

  const value = {
    products,
    currency,
    delivery_fee,
    navigate,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    backendUrl,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    token,
    setToken,
    logout, // ✅ Export logout
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
}
