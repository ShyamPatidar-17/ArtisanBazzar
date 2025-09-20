import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const Add = ({ token }) => {
  // Images
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  // Basic Info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [category, setCategory] = useState('Pottery');
  const [subCategory, setSubCategory] = useState('Vases');
  const [material, setMaterial] = useState('');
  const [region, setRegion] = useState('');
  const [stock, setStock] = useState(0);
  const [artisan, setArtisan] = useState('');

  // Arrays
  const [sizes, setSizes] = useState('');
  const [colors, setColors] = useState('');

  // Flags
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
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
    if (artisan) formData.append("artisan", artisan);
    formData.append("featured", featured);
    formData.append("bestseller", bestseller);

    // ✅ FIX: send images as image1, image2, image3, image4
    if (image1) formData.append("image1", image1);
    if (image2) formData.append("image2", image2);
    if (image3) formData.append("image3", image3);
    if (image4) formData.append("image4", image4);

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
      setName('');
      setDescription('');
      setPrice('');
      setDiscountPrice('');
      setCategory('Pottery');
      setSubCategory('Vases');
      setMaterial('');
      setRegion('');
      setSizes('');
      setColors('');
      setStock(0);
      setArtisan('');
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
    <form className='flex flex-col w-full items-start gap-4 p-6 bg-orange-50 rounded-lg shadow-md' onSubmit={handleSubmit}>
      
      {/* Image Upload */}
      <div>
        <p className='mb-2 text-orange-800 font-semibold'>Upload Images</p>
        <div className='flex gap-3'>
          {[image1, image2, image3, image4].map((img, idx) => (
            <label key={idx} htmlFor={`image${idx + 1}`} className='cursor-pointer'>
              <img
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt="Upload"
                className='w-24 h-24 object-cover rounded border-2 border-orange-300 hover:border-orange-500'
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
      <div className='w-full'>
        <p className='mb-2 text-orange-800 font-semibold'>Product Name</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder='Enter product name'
          className='w-full max-w-[500px] px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none'
        />
      </div>

      {/* Description */}
      <div className='w-full'>
        <p className='mb-2 text-orange-800 font-semibold'>Product Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder='Enter product description'
          className='w-full max-w-[500px] px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none'
        />
      </div>

      {/* Price & Discount */}
      <div className='flex flex-col sm:flex-row gap-4 w-full'>
        <div>
          <p className='mb-2 text-orange-800 font-semibold'>Price</p>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='Enter Price'
            className='w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none sm:w-[120px]'
          />
        </div>
        <div>
          <p className='mb-2 text-orange-800 font-semibold'>Discount Price</p>
          <input
            type="number"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder='Enter Discount Price'
            className='w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none sm:w-[150px]'
          />
        </div>
      </div>

      {/* Category & Subcategory */}
      <div className='flex flex-col sm:flex-row gap-4 w-full'>
        <div>
          <p className='mb-2 text-orange-800 font-semibold'>Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none'
          >
            <option value="Pottery">Pottery</option>
            <option value="Handicraft">Handicraft</option>
            <option value="Design">Design</option>
          </select>
        </div>

        <div>
          <p className='mb-2 text-orange-800 font-semibold'>Sub-Category</p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className='w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none'
          >
            <option value="Vases">Vases</option>
            <option value="Decor">Decor</option>
            <option value="Artworks">Artworks</option>
          </select>
        </div>
      </div>

      {/* Material & Region */}
      <div className='flex flex-col sm:flex-row gap-4 w-full'>
        <div>
          <p className='mb-2 text-orange-800 font-semibold'>Material</p>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder='Clay, Cotton, Wood, etc.'
            className='w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none'
          />
        </div>
        <div>
          <p className='mb-2 text-orange-800 font-semibold'>Region</p>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder='Rajasthan, Gujarat, etc.'
            className='w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none'
          />
        </div>
      </div>

      {/* Sizes & Colors */}
      <div className='flex flex-col sm:flex-row gap-4 w-full'>
        <div>
          <p className='mb-2 text-orange-800 font-semibold'>Sizes (comma separated)</p>
          <input
            type="text"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            placeholder='S, M, L, XL'
            className='w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none'
          />
        </div>
        <div>
          <p className='mb-2 text-orange-800 font-semibold'>Colors (comma separated)</p>
          <input
            type="text"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder='Red, Blue, Green'
            className='w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none'
          />
        </div>
      </div>

      {/* Stock & Artisan */}
      <div className='flex flex-col sm:flex-row gap-4 w-full'>
        <div>
          <p className='mb-2 text-orange-800 font-semibold'>Stock</p>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder='Enter stock count'
            className='w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none sm:w-[120px]'
          />
        </div>
        <div>
          <p className='mb-2 text-orange-800 font-semibold'>Artisan</p>
          <input
            type="text"
            value={artisan}
            onChange={(e) => setArtisan(e.target.value)}
            placeholder='Artisan Name / ID'
            className='w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-500 outline-none'
          />
        </div>
      </div>

      {/* Flags */}
      <div className='flex items-center gap-4 mt-2'>
        <label className='flex items-center gap-2 text-orange-800 font-semibold'>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className='accent-orange-500'
          />
          Featured
        </label>
        <label className='flex items-center gap-2 text-orange-800 font-semibold'>
          <input
            type="checkbox"
            checked={bestseller}
            onChange={(e) => setBestseller(e.target.checked)}
            className='accent-orange-500'
          />
          Bestseller
        </label>
      </div>

      {/* Submit */}
      <button
        type='submit'
        className='w-36 py-3 mt-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-semibold transition-all'
      >
        Add Product
      </button>
    </form>
  );
};

export default Add;
