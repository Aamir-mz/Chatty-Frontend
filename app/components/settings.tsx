"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Header from './header';
import Footer from './footer';

const SettingsPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    fullName: '',
  });
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        router.push('/signin');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      const response = await axiosInstance.get('http://localhost:4000/user', config);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        router.push('/signin');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      // Update user details
      await axiosInstance.patch(`http://localhost:4000/user/${user.id}/name`, { name: user.name }, config);
      await axiosInstance.patch(`http://localhost:4000/user/${user.id}/phone`, { phone: user.phone }, config);
      await axiosInstance.patch(`http://localhost:4000/user/${user.id}/email`, { email: user.email }, config);
      await axiosInstance.patch(`http://localhost:4000/user/${user.id}/fname`, { fullName: user.fullName }, config);

      // Update password
      if (password) {
        await axiosInstance.patch(`http://localhost:4000/user/${user.id}/password`, { password }, config);
      }

      // Update profile picture
      if (profilePicture) {
        const formData = new FormData();
        formData.append('file', profilePicture);
        await axiosInstance.post(`http://localhost:4000/user/${user.id}/profile-picture`, formData, {
          headers: {
            ...config.headers,
            'Content-Type': 'multipart/form-data',
          }
        });
      }

      alert('Profile updated successfully!');
      fetchCurrentUser(); // Refresh user data
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <div className="border p-4 rounded shadow-md">
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Profile Picture:
              <input
                type="file"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="border p-2 rounded w-full mt-2"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Name:
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Phone:
              <input
                type="text"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Email:
              <input
                type="text"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Full Name:
              <input
                type="text"
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </label>
          </div>
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Update Profile
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SettingsPage;
