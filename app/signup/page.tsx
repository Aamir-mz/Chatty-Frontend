"use client";
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/user', formData);
      console.log('Signup successful:', response.data);
      // Optionally, you can redirect the user to another page after successful signup
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle signup failure, such as displaying an error message to the user
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center' }}>Signup</h2>
        <form onSubmit={handleSubmit}>
          <div>
          <label style={{ color: '#333' }}>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={{color: '#333', width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' }} />
          </div>
          <div>
          <label style={{ color: '#333' }}>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ color: '#333',width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' }} />
          </div>
          <div>
          <label style={{ color: '#333' }}>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ color: '#333',width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' }} />
          </div>
          <div>
          <label style={{ color: '#333' }}>Full Name:</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} style={{color: '#333', width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' }} />
          </div>
          <div>
          <label style={{ color: '#333' }}>Phone:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ color: '#333',width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Signup</button>
        </form>
        <Link href="/signin">
        <div className="text-blue-500 underline mb-8">Login here</div>
      </Link>
      </div>
    </div>
  );
};

export default SignupPage;
