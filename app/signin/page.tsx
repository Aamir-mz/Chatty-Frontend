// LoginPage.js

"use client";
// LoginPage.js


import { useState } from 'react';
import Header from '../components/header'; // Import Header component
import Footer from '../components/footer'; // Import Footer component
import axiosInstance from '../utils/axiosInstance';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router= useRouter();
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>  {
    e.preventDefault();
  
    try {
      const response = await axiosInstance.post('http://localhost:4000/auth/login', { email, password });

      const data = response.data;
      
      // Extract access token from the response
      const accessToken = data.access_token;
  
      // Store access token in local storage
      localStorage.setItem('accessToken', accessToken);
  
      // Redirect the user to the dashboard or any other protected route
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error.message);
      // Handle other errors (e.g., network error)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header /> {/* Include Header component */}
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
    Email
  </label>
  <input
    className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
    id="email"
    type="email"
    placeholder="Email"
    value={email}
    onChange={handleEmailChange}
  />
</div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        <Link href="/forgot-password">
        <div className="text-blue-500 underline mb-8">Forgot Password?</div>
      </Link>
        <Link href="/signup">
        <div className="text-blue-500 underline mb-8">Don't have an account? Signup here</div>
      </Link>
      </div>
      <Footer /> {/* Include Footer component */}
    </div>
  );
};

export default LoginPage;


