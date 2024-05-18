"use client";

import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Footer from '../components/footer';
import Header from '../components/header';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await axiosInstance.post('http://localhost:4000/auth/forgot-password', { email });
      setMessage('Password reset link sent to your email');
    } catch (error) {
      console.error('Error sending password reset link:', error);
      setMessage('Error sending password reset link');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header />
      <div className="container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleForgotPassword}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Send Reset Link
        </button>
        {message && <p className="mt-4">{message}</p>}
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
