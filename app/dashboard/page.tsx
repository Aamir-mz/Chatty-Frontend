"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Footer from '../components/footer';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import Link from 'next/link';

const DashboardPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    fetchMessages();
    fetchCurrentUser();
  }, []);

  const fetchMessages = async () => {
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

      const response = await axiosInstance.get('http://localhost:4000/messages', config);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

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
      setCurrentUser(response.data.name);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/signin');
  };

  const handleViewMessage = (messageId) => {
    router.push(`/messages/${messageId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex flex-col items-center justify-center w-full">
        <Header />
        <div className="container mx-auto mt-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard, {currentUser}</h1>
          <h2 className="text-xl font-bold mb-2">Inbox:</h2>
          <ul>
            {messages.map((message) => (
              <li
                key={message.id}
                className="cursor-pointer mb-2 p-2 border border-gray-700 rounded hover:bg-gray-800"
                onClick={() => handleViewMessage(message.id)}
              >
                <div>
                  <strong>{message.sender}</strong>:
                </div>
                <div>{message.content}</div>
              </li>
            ))}
          </ul>
          <Link href="/sendmessage">
            <div className="text-blue-500 underline mb-8 cursor-pointer">Send Message</div>
          </Link>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardPage;
