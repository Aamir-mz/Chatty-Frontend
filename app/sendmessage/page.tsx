// SendMessagePage.js
"use client";
import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useRouter } from 'next/navigation';

const SendMessagePage = () => {
  const router = useRouter();
  const [recipientUsername, setRecipientUsername] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSendMessage = async () => {
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

      const data = {
        recipientUsername,
        content
      };

      await axiosInstance.post('http://localhost:4000/messages', data, config);
      // Optionally, you can redirect the user to the inbox after sending the message
      router.push('/dashboard');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center text-black">Send a Message</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-black">Recipient Username</span>
          </label>
          <input
            type="text"
            placeholder="Recipient Username"
            className="input input-bordered w-full"
            value={recipientUsername}
            onChange={(e) => setRecipientUsername(e.target.value)}
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-black">Message Content</span>
          </label>
          <textarea
            placeholder="Message Content"
            className="textarea textarea-bordered w-full"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary w-full"
          onClick={handleSendMessage}
        >
          Send Message
        </button>
      </div>
    </div>
  );
  
};

export default SendMessagePage;
