import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');

  const fetchProductData = async () => {
    const item = products.find((p) => p._id === productId);
    if (item) {
      setProductData(item);
      setImage(item.image[0]);
    }
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Section */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        
        {/* Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item, index) => (
                <img 
                  onClick={() => setImage(item)} 
                  src={item} 
                  key={index} 
                  alt="" 
                  className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border hover:border-orange-500' 
                />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} alt="IMAGE" className='w-full h-auto rounded-lg' />
          </div>
        </div>

        {/* Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          
          {/* Rating */}
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_dull_icon} alt="" className='w-3.5' />
            <p className='pl-2'>(122)</p>
          </div>

          {/* Price with discount */}
          <div className='mt-5'>
            {productData.discountPrice ? (
              <div className='flex items-center gap-3'>
                <p className='text-3xl font-medium text-orange-600'>
                  {currency} {productData.discountPrice}
                </p>
                <p className='text-xl text-gray-500 line-through'>
                  {currency} {productData.price}
                </p>
              </div>
            ) : (
              <p className='text-3xl font-medium'>
                {currency} {productData.price}
              </p>
            )}
          </div>

          {/* Description */}
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          {/* Extra info */}
          <div className='mt-5 text-sm text-gray-700'>
            <p><b>Material:</b> {productData.material || 'N/A'}</p>
            <p><b>Region:</b> {productData.region || 'N/A'}</p>
            <p><b>Artisan:</b> {productData.artisan || 'Unknown'}</p>
            <p><b>Stock:</b> {productData.stock > 0 ? `${productData.stock} available` : 'Out of stock'}</p>
            {productData.bestseller && <span className='text-orange-600 font-semibold'>★ Bestseller</span>}
          </div>

          {/* Sizes */}
          {productData.sizes?.length > 0 && (
            <div className='flex flex-col gap-4 my-8'>
              <p>Select Size</p>
              <div className='flex gap-2'>
                {productData.sizes.map((item, index) => (
                  <button 
                    key={index} 
                    onClick={() => setSize(item)} 
                    className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {productData.colors?.length > 0 && (
            <div className='flex flex-col gap-4 my-8'>
              <p>Select Color</p>
              <div className='flex gap-2'>
                {productData.colors.map((c, index) => (
                  <button 
                    key={index} 
                    onClick={() => setColor(c)} 
                    className={`border px-4 py-2 rounded-full ${c === color ? 'border-orange-500' : ''}`}
                    style={{ backgroundColor: c.toLowerCase() }}
                  >
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button 
            disabled={productData.stock <= 0} 
            className={`px-8 py-3 text-sm text-white ${productData.stock > 0 ? 'bg-black active:bg-gray-700' : 'bg-gray-400 cursor-not-allowed'}`}
            onClick={() => addToCart(productData._id, size, color)}
          >
            {productData.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <hr className='mt-8 sm:w-4/5' />

          {/* Guarantee */}
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original Product</p>
            <p>Cash on delivery Available</p>
            <p>Easy return and exchange within 7 days</p>
          </div>
        </div>
      </div>

      {/* Description + Review */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>{productData.description}</p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className='opacity-0'></div>;
}

export default Product;
