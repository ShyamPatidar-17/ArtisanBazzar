// ShopContext.jsx
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

export default function ShopContextProvider({ children }) {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // ✅ restore from localStorage
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Login function
  const login = (newToken, newRole, newUserId) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("userId", newUserId);   // ✅ Save userId
    setToken(newToken);
    toast.success("Logged in successfully");
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");           // ✅ Remove userId
    setToken("");
    setCartItems({});
    toast.success("Logged out successfully");
    navigate("/");
  };
  // ---------------- Cart Functions ----------------
  const addToCart = (id, size, color) => {
    setCartItems((prev) => {
      const key = `${size || "default"}-${color || "default"}`;
      const newCart = { ...prev };
      if (!newCart[id]) newCart[id] = {};
      if (!newCart[id][key]) newCart[id][key] = 0;
      newCart[id][key] += 1;
      return newCart;
    });
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += cartItems[itemId][size] || 0;
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { Authorization: `Bearer ${token}` } } // ✅ fixed
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

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

  // ---------------- API Calls ----------------
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
    } finally {
      setLoading(false);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { Authorization: `Bearer ${token}` } } // ✅ fixed
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ---------------- Effects ----------------
  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    if (token) getUserCart(token);
    else setCartItems({});
  }, [token]);



  // ---------------- Messaging Functions ----------------

  // Send a message
  const sendMessage = async (receiverId, content) => {
    try {
      const senderId = localStorage.getItem("userId");
      const response = await axios.post(
        backendUrl + "/api/messages",
        { sender: senderId, receiver: receiverId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Send Message Error:", error);
    }
  };

  // Fetch chat between current user and another
  const getMessages = async (otherId) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${backendUrl}/api/messages/${userId}/${otherId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch messages");
      console.error("Get Messages Error:", error);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (otherId) => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post(
        backendUrl + "/api/messages/read",
        { userId, otherId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Mark Read Error:", error);
    }
  };


  // ---------------- Context Value ----------------
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
    login,
    logout,
    loading,
    sendMessage,
    getMessages,
    markMessagesAsRead,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
