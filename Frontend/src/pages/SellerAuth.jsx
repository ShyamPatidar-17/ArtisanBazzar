import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SellerAuth = () => {
    const [mode, setMode] = useState("login");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        shopName: "",
        gstNumber: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url =
                mode === "signup"
                    ? `${backendUrl}/api/sellers/register`
                    : `${backendUrl}/api/sellers/login`;


            const payload =
                mode === "signup"
                    ? {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        shopName: formData.shopName,
                        gstNumber: formData.gstNumber,
                    }
                    : {
                        email: formData.email,
                        password: formData.password,
                    };

            const res = await axios.post(url, payload);

            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                toast.success(`Seller ${mode} successful!`);
                navigate("/");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-green-100">
            <div className="bg-white shadow-xl p-8 rounded-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {mode === "signup" ? "Seller Signup" : "Seller Login"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "signup" && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Owner Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                name="shopName"
                                placeholder="Shop Name"
                                value={formData.shopName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                name="gstNumber"
                                placeholder="GST Number"
                                value={formData.gstNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </>
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Business Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
                    >
                        {mode === "signup" ? "Signup" : "Login"}
                    </button>
                </form>
                <p className="mt-4 text-center">
                    {mode === "signup" ? "Already a seller?" : "New seller?"}{" "}
                    <button
                        onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                        className="text-blue-500 underline"
                    >
                        {mode === "signup" ? "Login" : "Signup"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SellerAuth;
