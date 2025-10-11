import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import {jwtDecode} from "jwt-decode"; // ✅ correct import

const Add = () => {
  // Token
  const token = localStorage.getItem("sellerToken") || "";
  const [sellerId, setSellerId] = useState("");
  const [createdBy,setCreatedBy]=useState("");

  // Images
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  // Basic Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [category, setCategory] = useState("Pottery");
  const [subCategory, setSubCategory] = useState("Vases");
  const [material, setMaterial] = useState("");
  const [region, setRegion] = useState("");
  const [stock, setStock] = useState(0);

  // Arrays
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");

  // Flags
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);

  // Decode JWT and set sellerId
  useEffect(() => {
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded); // 👀 check the payload structure
      setSellerId(decoded.id || decoded._id || decoded.userId);
    } catch (err) {
      console.error("Token decode error:", err);
    }
  }
}, [token]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sellerId) {
      toast.error("Seller ID missing. Please log in again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      if (discountPrice) formData.append("discountPrice", discountPrice);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      if (material) formData.append("material", material);
      if (region) formData.append("region", region);
      if (sizes) formData.append("sizes", JSON.stringify(sizes.split(",")));
      if (colors) formData.append("colors", JSON.stringify(colors.split(",")));
      formData.append("stock", stock);
      formData.append("featured", featured);
      formData.append("bestseller", bestseller);

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      // Auto-set sellerId
      formData.append("createdBy", sellerId);
      formData.append("artisan", sellerId);

      const response = await axios.post(
        `${backendUrl}/api/products/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Product added successfully!");
        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setDiscountPrice("");
        setCategory("Pottery");
        setSubCategory("Vases");
        setMaterial("");
        setRegion("");
        setSizes("");
        setColors("");
        setStock(0);
        setFeatured(false);
        setBestseller(false);
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      } else {
        toast.error(response.data.message || "Error adding product");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      className="flex flex-col w-full items-start gap-4 p-6 bg-orange-50 rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      {/* Image Upload */}
      <div>
        <p className="mb-2 text-orange-800 font-semibold">Upload Images</p>
        <div className="flex gap-3">
          {[image1, image2, image3, image4].map((img, idx) => (
            <label key={idx} htmlFor={`image${idx + 1}`} className="cursor-pointer">
              <img
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt="Upload"
                className="w-24 h-24 object-cover rounded border-2 border-orange-300 hover:border-orange-500"
              />
              <input
                type="file"
                id={`image${idx + 1}`}
                hidden
                onChange={(e) => {
                  const setter = [setImage1, setImage2, setImage3, setImage4][idx];
                  setter(e.target.files[0]);
                }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2 text-orange-800 font-semibold">Product Name</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter product name"
          className="w-full max-w-[500px] px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none"
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="mb-2 text-orange-800 font-semibold">Product Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Enter product description"
          className="w-full max-w-[500px] px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none"
        />
      </div>

      {/* Price & Discount */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div>
          <p className="mb-2 text-orange-800 font-semibold">Price</p>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter Price"
            className="w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none sm:w-[120px]"
          />
        </div>
        <div>
          <p className="mb-2 text-orange-800 font-semibold">Discount Price</p>
          <input
            type="number"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter Discount Price"
            className="w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none sm:w-[150px]"
          />
        </div>
      </div>

      {/* Category & Subcategory */}
      {/* Category & Subcategory */}
<div className="flex flex-col sm:flex-row gap-4 w-full">
  <div>
    <p className="mb-2 text-orange-800 font-semibold">Category</p>
    <select
      value={category}
      onChange={(e) => {
        setCategory(e.target.value);
        setSubCategory(""); // reset subcategory when category changes
      }}
      className="w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none"
    >
      <option value="">Select Category</option>
      <option value="Pottery">Pottery</option>
      <option value="Handicraft">Handicraft</option>
      <option value="Textile">Textile</option>
      <option value="Jewelry">Jewelry</option>
      <option value="Painting">Painting</option>
      <option value="Metalwork">Metalwork</option>
      <option value="Woodwork">Woodwork</option>
      <option value="Bamboo">Bamboo & Cane</option>
      <option value="Leather">Leather</option>
      <option value="Stone">Stone Carving</option>
      <option value="Glass">Glass Work</option>
      <option value="Paper">Paper Crafts</option>
      <option value="Tribal">Tribal Art</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <div>
    <p className="mb-2 text-orange-800 font-semibold">Sub-Category</p>
    <select
      value={subCategory}
      onChange={(e) => setSubCategory(e.target.value)}
      className="w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none"
    >
      <option value="">Select Sub-Category</option>

      {/* Pottery */}
      {category === "Pottery" && (
        <>
          <option value="Vases">Vases</option>
          <option value="Bowls">Bowls</option>
          <option value="Pots">Pots</option>
          <option value="Decor">Decor</option>
        </>
      )}

      {/* Handicraft */}
      {category === "Handicraft" && (
        <>
          <option value="Home Decor">Home Decor</option>
          <option value="Toys">Toys</option>
          <option value="Festive Items">Festive Items</option>
          <option value="Religious Idols">Religious Idols</option>
        </>
      )}

      {/* Textile */}
      {category === "Textile" && (
        <>
          <option value="Sarees">Sarees</option>
          <option value="Dupattas">Dupattas</option>
          <option value="Shawls">Shawls</option>
          <option value="Cushion Covers">Cushion Covers</option>
          <option value="Bags">Bags</option>
        </>
      )}

      {/* Jewelry */}
      {category === "Jewelry" && (
        <>
          <option value="Necklaces">Necklaces</option>
          <option value="Earrings">Earrings</option>
          <option value="Bangles">Bangles</option>
          <option value="Rings">Rings</option>
        </>
      )}

      {/* Painting */}
      {category === "Painting" && (
        <>
          <option value="Madhubani">Madhubani</option>
          <option value="Warli">Warli</option>
          <option value="Pattachitra">Pattachitra</option>
          <option value="Miniature">Miniature</option>
        </>
      )}

      {/* Metalwork */}
      {category === "Metalwork" && (
        <>
          <option value="Utensils">Utensils</option>
          <option value="Decor">Decor</option>
          <option value="Idols">Idols</option>
        </>
      )}

      {/* Woodwork */}
      {category === "Woodwork" && (
        <>
          <option value="Furniture">Furniture</option>
          <option value="Toys">Toys</option>
          <option value="Sculptures">Sculptures</option>
        </>
      )}

      {/* Bamboo & Cane */}
      {category === "Bamboo" && (
        <>
          <option value="Baskets">Baskets</option>
          <option value="Furniture">Furniture</option>
          <option value="Mats">Mats</option>
        </>
      )}

      {/* Leather */}
      {category === "Leather" && (
        <>
          <option value="Footwear">Footwear</option>
          <option value="Bags">Bags</option>
          <option value="Wallets">Wallets</option>
        </>
      )}

      {/* Stone */}
      {category === "Stone" && (
        <>
          <option value="Sculptures">Sculptures</option>
          <option value="Idols">Idols</option>
          <option value="Decor">Decor</option>
        </>
      )}

      {/* Glass */}
      {category === "Glass" && (
        <>
          <option value="Glassware">Glassware</option>
          <option value="Decor">Decor</option>
        </>
      )}

      {/* Paper */}
      {category === "Paper" && (
        <>
          <option value="Papier Mache">Papier Mache</option>
          <option value="Origami">Origami</option>
          <option value="Lanterns">Lanterns</option>
        </>
      )}

      {/* Tribal */}
      {category === "Tribal" && (
        <>
          <option value="Masks">Masks</option>
          <option value="Wall Art">Wall Art</option>
          <option value="Decor">Decor</option>
        </>
      )}

      {/* Other */}
      {category === "Other" && <option value="Misc">Miscellaneous</option>}
    </select>
  </div>
</div>


     {/* Material & Region */}
<div className="flex flex-col sm:flex-row gap-4 w-full">
  {/* Material Dropdown */}
  <div>
    <p className="mb-2 text-orange-800 font-semibold">Material</p>
    <select
      value={material}
      onChange={(e) => setMaterial(e.target.value)}
      className="w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none"
    >
      <option value="">Select Material</option>
      <option value="Clay">Clay</option>
      <option value="Wood">Wood</option>
      <option value="Metal">Metal</option>
      <option value="Stone">Stone</option>
      <option value="Textile">Textile</option>
      <option value="Glass">Glass</option>
      <option value="Bamboo">Bamboo</option>
      <option value="Paper">Paper</option>
      <option value="Leather">Leather</option>
      <option value="Other">Other</option>
    </select>
  </div>

  {/* Region Dropdown */}
  <div>
    <p className="mb-2 text-orange-800 font-semibold">Region</p>
    <select
      value={region}
      onChange={(e) => setRegion(e.target.value)}
      className="w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none"
    >
      <option value="">Select Region</option>
      {/* States */}
      <option value="Andhra Pradesh">Andhra Pradesh</option>
      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
      <option value="Assam">Assam</option>
      <option value="Bihar">Bihar</option>
      <option value="Chhattisgarh">Chhattisgarh</option>
      <option value="Goa">Goa</option>
      <option value="Gujarat">Gujarat</option>
      <option value="Haryana">Haryana</option>
      <option value="Himachal Pradesh">Himachal Pradesh</option>
      <option value="Jharkhand">Jharkhand</option>
      <option value="Karnataka">Karnataka</option>
      <option value="Kerala">Kerala</option>
      <option value="Madhya Pradesh">Madhya Pradesh</option>
      <option value="Maharashtra">Maharashtra</option>
      <option value="Manipur">Manipur</option>
      <option value="Meghalaya">Meghalaya</option>
      <option value="Mizoram">Mizoram</option>
      <option value="Nagaland">Nagaland</option>
      <option value="Odisha">Odisha</option>
      <option value="Punjab">Punjab</option>
      <option value="Rajasthan">Rajasthan</option>
      <option value="Sikkim">Sikkim</option>
      <option value="Tamil Nadu">Tamil Nadu</option>
      <option value="Telangana">Telangana</option>
      <option value="Tripura">Tripura</option>
      <option value="Uttar Pradesh">Uttar Pradesh</option>
      <option value="Uttarakhand">Uttarakhand</option>
      <option value="West Bengal">West Bengal</option>

      {/* Union Territories */}
      <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
      <option value="Chandigarh">Chandigarh</option>
      <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
      <option value="Delhi">Delhi</option>
      <option value="Jammu and Kashmir">Jammu and Kashmir</option>
      <option value="Ladakh">Ladakh</option>
      <option value="Lakshadweep">Lakshadweep</option>
      <option value="Puducherry">Puducherry</option>
    </select>
  </div>
</div>

{/* Sizes — only visible if material is Textile */}
<div>
{material === "Textile" && (
  <div className="w-full mt-4">
    <p className="mb-2 text-orange-800 font-semibold">Sizes (comma separated)</p>
    <input
      type="text"
      value={sizes}
      onChange={(e) => setSizes(e.target.value)}
      placeholder="S, M, L, XL"
      className="w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none"
    />
  </div>
)}
        <div>
          <p className="mb-2 text-orange-800 font-semibold">Colors (comma separated)</p>
          <input
            type="text"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="Red, Blue, Green"
            className="w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none"
          />
        </div>
      </div>

      {/* Stock */}
      <div className="w-full">
        <p className="mb-2 text-orange-800 font-semibold">Stock</p>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Enter stock count"
          className="w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none sm:w-[120px]"
        />
      </div>

      {/* Flags */}
      <div className="flex items-center gap-4 mt-2">
        <label className="flex items-center gap-2 text-orange-800 font-semibold">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="accent-orange-500"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-orange-800 font-semibold">
          <input
            type="checkbox"
            checked={bestseller}
            onChange={(e) => setBestseller(e.target.checked)}
            className="accent-orange-500"
          />
          Bestseller
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-36 py-3 mt-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-semibold transition-all"
      >
        Add Product
      </button>
    </form>
  );
};

export default Add;
