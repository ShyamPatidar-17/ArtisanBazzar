import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { jwtDecode } from "jwt-decode";

const Add = () => {
  const token = localStorage.getItem("sellerToken") || "";
  const [sellerId, setSellerId] = useState("");

  // 4 Images
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [category, setCategory] = useState("Pottery");
  const [subCategory, setSubCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [region, setRegion] = useState("");
  const [stock, setStock] = useState("");
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);

  // Error State
  const [errors, setErrors] = useState({});

  // Decode seller ID
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setSellerId(decoded.id || decoded._id || decoded.userId);
      } catch (err) {
        console.error("JWT error:", err);
      }
    }
  }, [token]);

  // Validate each image (max 700 KB)
  const validateAndSetImage = (file, setter) => {
    if (!file) return;
    if (file.size > 700 * 1024) {
      setErrors((prev) => ({
        ...prev,
        images: "Each image must be under 700 KB!",
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, images: "" }));
    setter(file);
  };

  // Validation before submit
  const validateForm = () => {
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Product name is required";
    if (!description.trim())
      newErrors.description = "Product description is required";
    if (!price) newErrors.price = "Price is required";
    if (!category) newErrors.category = "Select a category";
    if (!subCategory) newErrors.subCategory = "Select a subcategory";
    if (!material) newErrors.material = "Select material";
    if (!region) newErrors.region = "Select region";
    if (!stock) newErrors.stock = "Stock is required";
    if (!colors.trim()) newErrors.colors = "Enter at least one color";

    if (!image1 && !image2 && !image3 && !image4) {
      newErrors.images = "Please upload at least 1 image";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sellerId) {
      toast.error("Seller ID missing. Login again.");
      return;
    }

    if (!validateForm()) return;

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

      formData.append("image1", image1);
      formData.append("image2", image2);
      formData.append("image3", image3);
      formData.append("image4", image4);

      formData.append("createdBy", sellerId);
      formData.append("artisan", sellerId);

      const res = await axios.post(`${backendUrl}/api/products/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Product added!");

        // Reset
        setName("");
        setDescription("");
        setPrice("");
        setDiscountPrice("");
        setCategory("Pottery");
        setSubCategory("");
        setMaterial("");
        setRegion("");
        setSizes("");
        setColors("");
        setStock("");
        setFeatured(false);
        setBestseller(false);
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setErrors({});
      } else {
        toast.error(res.data.message || "Error adding product");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      {/* LEFT FORM */}
      <form
        className="flex flex-col w-full lg:w-2/3 items-start gap-4 p-6 bg-orange-50 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        {/* IMAGE UPLOAD */}
        <div>
          <p className="mb-2 text-orange-800 font-semibold">
            Upload Images (Max 700KB each)
          </p>

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
                  accept="image/*"
                  onChange={(e) =>
                    validateAndSetImage(
                      e.target.files[0],
                      [setImage1, setImage2, setImage3, setImage4][idx]
                    )
                  }
                />
              </label>
            ))}
          </div>

          {errors.images && (
            <p className="text-red-600 text-sm mt-1">{errors.images}</p>
          )}
        </div>

        {/* PRODUCT NAME */}
        <div className="w-full">
          <p className="mb-2 text-orange-800 font-semibold">Product Name</p>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
            className="w-full max-w-[500px] px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500"
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="w-full">
          <p className="mb-2 text-orange-800 font-semibold">Product Description</p>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
            className="w-full max-w-[500px] px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500"
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description}</p>
          )}
        </div>

        {/* PRICE */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div>
            <p className="mb-2 text-orange-800 font-semibold">Price</p>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setErrors((prev) => ({ ...prev, price: "" }));
              }}
              className="px-3 py-2 border-2 border-orange-300 rounded"
              placeholder="Enter Price"
            />
            {errors.price && (
              <p className="text-red-600 text-sm">{errors.price}</p>
            )}
          </div>

          <div>
            <p className="mb-2 text-orange-800 font-semibold">Discount Price</p>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="px-3 py-2 border-2 border-orange-300 rounded"
              placeholder="Enter Discount Price"
            />
          </div>
        </div>

        {/* CATEGORY & SUBCATEGORY */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div>
            <p className="mb-2 text-orange-800 font-semibold">Category</p>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory("");
                setErrors((prev) => ({ ...prev, category: "" }));
              }}
              className="px-3 py-2 border-2 border-orange-300 rounded"
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
            {errors.category && (
              <p className="text-red-600 text-sm">{errors.category}</p>
            )}
          </div>

          <div>
            <p className="mb-2 text-orange-800 font-semibold">Sub Category</p>
            <select
              value={subCategory}
              onChange={(e) => {
                setSubCategory(e.target.value);
                setErrors((prev) => ({ ...prev, subCategory: "" }));
              }}
              className="px-3 py-2 border-2 border-orange-300 rounded"
            >
              <option value="">Select Sub-Category</option>

              {category === "Pottery" && (
                <>
                  <option>Vases</option>
                  <option>Bowls</option>
                  <option>Pots</option>
                  <option>Decor</option>
                </>
              )}

              {category === "Handicraft" && (
                <>
                  <option>Home Decor</option>
                  <option>Toys</option>
                  <option>Festive Items</option>
                  <option>Religious Idols</option>
                </>
              )}

              {category === "Textile" && (
                <>
                  <option>Sarees</option>
                  <option>Dupattas</option>
                  <option>Shawls</option>
                  <option>Cushion Covers</option>
                  <option>Bags</option>
                </>
              )}

              {category === "Jewelry" && (
                <>
                  <option>Necklaces</option>
                  <option>Earrings</option>
                  <option>Bangles</option>
                  <option>Rings</option>
                </>
              )}

              {category === "Painting" && (
                <>
                  <option>Madhubani</option>
                  <option>Warli</option>
                  <option>Pattachitra</option>
                  <option>Miniature</option>
                </>
              )}

              {category === "Metalwork" && (
                <>
                  <option>Utensils</option>
                  <option>Decor</option>
                  <option>Idols</option>
                </>
              )}

              {category === "Woodwork" && (
                <>
                  <option>Furniture</option>
                  <option>Toys</option>
                  <option>Sculptures</option>
                </>
              )}

              {category === "Bamboo" && (
                <>
                  <option>Baskets</option>
                  <option>Furniture</option>
                  <option>Mats</option>
                </>
              )}

              {category === "Leather" && (
                <>
                  <option>Footwear</option>
                  <option>Bags</option>
                  <option>Wallets</option>
                </>
              )}

              {category === "Stone" && (
                <>
                  <option>Sculptures</option>
                  <option>Idols</option>
                  <option>Decor</option>
                </>
              )}

              {category === "Glass" && (
                <>
                  <option>Glassware</option>
                  <option>Decor</option>
                </>
              )}

              {category === "Paper" && (
                <>
                  <option>Papier Mache</option>
                  <option>Origami</option>
                  <option>Lanterns</option>
                </>
              )}

              {category === "Tribal" && (
                <>
                  <option>Masks</option>
                  <option>Wall Art</option>
                  <option>Decor</option>
                </>
              )}

              {category === "Other" && (
                <option>Miscellaneous</option>
              )}
            </select>
            {errors.subCategory && (
              <p className="text-red-600 text-sm">{errors.subCategory}</p>
            )}
          </div>
        </div>

        {/* MATERIAL + REGION */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div>
            <p className="mb-2 text-orange-800 font-semibold">Material</p>
            <select
              value={material}
              onChange={(e) => {
                setMaterial(e.target.value);
                setErrors((prev) => ({ ...prev, material: "" }));
              }}
              className="px-3 py-2 border-2 border-orange-300 rounded"
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
            {errors.material && (
              <p className="text-red-600 text-sm">{errors.material}</p>
            )}
          </div>

          <div>
            <p className="mb-2 text-orange-800 font-semibold">Region</p>
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setErrors((prev) => ({ ...prev, region: "" }));
              }}
              className="px-3 py-2 border-2 border-orange-300 rounded"
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
              <option value="Andaman and Nicobar Islands">
                Andaman and Nicobar Islands
              </option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Dadra and Nagar Haveli and Daman and Diu">
                Dadra and Nagar Haveli and Daman and Diu
              </option>
              <option value="Delhi">Delhi</option>
              <option value="Jammu and Kashmir">Jammu and Kashmir</option>
              <option value="Ladakh">Ladakh</option>
              <option value="Lakshadweep">Lakshadweep</option>
              <option value="Puducherry">Puducherry</option>
            </select>

            {errors.region && (
              <p className="text-red-600 text-sm">{errors.region}</p>
            )}
          </div>
        </div>

        {/* SIZES + COLORS */}
        <div className="w-full">
          {material === "Textile" && (
            <div className="w-full mt-4">
              <p className="mb-2 text-orange-800 font-semibold">
                Sizes (comma separated)
              </p>
              <input
                type="text"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="S, M, L, XL"
                className="w-full px-3 py-2 border-2 border-orange-300 rounded"
              />
            </div>
          )}

          <div className="mt-4">
            <p className="mb-2 text-orange-800 font-semibold">
              Colors (comma separated)
            </p>
            <input
              type="text"
              value={colors}
              onChange={(e) => {
                setColors(e.target.value);
                setErrors((prev) => ({ ...prev, colors: "" }));
              }}
              placeholder="Red, Blue, Green"
              className="w-full px-3 py-2 border-2 border-orange-300 rounded"
            />
            {errors.colors && (
              <p className="text-red-600 text-sm">{errors.colors}</p>
            )}
          </div>
        </div>

        {/* STOCK */}
        <div className="w-full">
          <p className="mb-2 text-orange-800 font-semibold">Stock</p>
          <input
            type="number"
            value={stock}
            onChange={(e) => {
              setStock(e.target.value);
              setErrors((prev) => ({ ...prev, stock: "" }));
            }}
            placeholder="Enter stock count"
            className="w-full px-3 py-2 border-2 border-orange-300 rounded sm:w-[120px]"
          />
          {errors.stock && (
            <p className="text-red-600 text-sm">{errors.stock}</p>
          )}
        </div>

        {/* FLAGS */}
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

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-36 py-3 mt-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-semibold"
        >
          Add Product
        </button>
      </form>

      {/* RIGHT — PREVIEW SECTION */}
      <div className="w-full lg:w-1/3 p-6 bg-white shadow-md rounded-lg flex flex-col gap-4">
        <div className="flex justify-center">
          <img
            src={assets.logo}
            alt="artisanbazzar"
            className="w-32 h-auto"
          />
        </div>

        <h2 className="text-4xl font-bold text-orange-700 text-center">
          Product Preview
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {[image1, image2, image3, image4].map(
            (img, i) =>
              img && (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  alt={`preview-${i + 1}`}
                  className="w-full h-28 object-cover rounded border"
                />
              )
          )}
        </div>

        <div className="text-xl text-red-900 space-y-1">
          <p><strong>Name: </strong>{name || "-"}</p>
          <p><strong>Category: </strong>{category || "-"}</p>
          <p><strong>Sub-category: </strong>{subCategory || "-"}</p>
          <p><strong>Material: </strong>{material || "-"}</p>
          <p><strong>Region: </strong>{region || "-"}</p>
          <p><strong>Price: </strong>₹{price || "0"}</p>
          <p><strong>Discount Price: </strong>₹{discountPrice || "0"}</p>
          <p><strong>Stock: </strong>{stock || "0"}</p>
        </div>
      </div>
    </div>
  );
};

export default Add;
