import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [profile, setProfile] = useState(null);

  const getProfileData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token },
      });

      console.log(response.data)

      if (response.data.success) {
        setProfile(response.data.user);
      } else {
        toast.error(response.data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      toast.error('Error fetching profile');
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      getProfileData();
    }
  }, [token]);

  if (!token) {
    return <div className='mt-10 text-center text-xl text-red-600'>Please login to view your profile.</div>;
  }

  if (!profile) {
    return <div className='mt-10 text-center'>Loading profile...</div>;
  }

  return (
    <div className='max-w-2xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-lg'>
      <h2 className='text-2xl font-bold mb-6 text-center'>My Profile</h2>

      <div className='mb-4'>
        <label className='font-medium text-gray-700'>Name:</label>
        <p className='text-gray-800'>{profile.name}</p>
      </div>

      <div className='mb-4'>
        <label className='font-medium text-gray-700'>Email:</label>
        <p className='text-gray-800'>{profile.email}</p>
      </div>

      <div className='mb-4'>
        <label className='font-medium text-gray-700'>Registered On:</label>
        <p className='text-gray-800'>{new Date(profile.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Optional: Link to orders */}
      <div className='mt-6'>
        <a href='/orders' className='text-blue-600 underline hover:text-blue-800'>
          View My Orders →
        </a>
      </div>
    </div>
  );
};

export default Profile;
