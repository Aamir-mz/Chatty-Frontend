// app/message/MessagePage.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const MessagePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (id) {
      fetchMessage(id);
    }
  }, [id]);

  const fetchMessage = async (messageId: string) => {
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

      const response = await axiosInstance.get(`http://localhost:4000/messages/${messageId}`, config);
      setMessage(response.data);
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  return (
    <div>
      {message ? (
        <div>
          <h1>Message from {message.sender.name}</h1>
          <p>{message.content}</p>
        </div>
      ) : (
        <p>Loading message...</p>
      )}
    </div>
  );
};

export default MessagePage;
