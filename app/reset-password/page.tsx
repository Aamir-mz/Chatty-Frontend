"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Footer from '../components/Footer';
import Header from '../components/Header';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage('Invalid password reset link');
    }
  }, []);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axiosInstance.post('http://localhost:4000/auth/reset-password', { token, newPassword });
      setMessage('Password reset successfully');
      setTimeout(() => {
        router.push('/signin');
      }, 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Error resetting password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto mt-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        {message && <p className="mb-4 text-red-500">{message}</p>}
        {token && (
          <>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <button
              onClick={handleResetPassword}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
