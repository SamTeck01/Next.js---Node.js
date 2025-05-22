'use client';
import React, { useState, useEffect, useRef } from 'react';

const MainContent = () => {
  const [messages, setMessages] = useState([]);
  const [messageValue, setMessageValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socket = useRef(null);
  const reconnectTimeout = useRef(null);

  const fetchAll = async () => {
    try {
      const res = await fetch('http://localhost:8080/messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Fetching Failed, Reason:', error);
    }
  };

  const connectWebSocket = () => {
    if (socket.current) socket.current.close();

    socket.current = new WebSocket('ws://localhost:8080');

    socket.current.onopen = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      fetchAll();
    };

    socket.current.onmessage = (event) => {
      setMessages((prev) => [...prev, { sender: 'Server', text: event.data }]);
    };

    socket.current.onclose = () => {
      console.warn('❌ WebSocket closed. Reconnecting...');
      setIsConnected(null);
      reconnectTimeout.current = setTimeout(connectWebSocket, 500); // try reconnect
      setIsConnected(true)
    };

    socket.current.onerror = (err) => {
      console.error('⚠️ WebSocket error:', err);
      socket.current.close(); // triggers onclose
    };
  };

  useEffect(() => {
    connectWebSocket();
    fetchAll();

    return () => {
      socket.current?.close();
      clearTimeout(reconnectTimeout.current);
    };
  }, []);

  const submitMessage = (e) => {
    e.preventDefault();

    if (socket.current?.readyState === WebSocket.OPEN && messageValue.trim()) {
      socket.current.send(messageValue);
      setMessages((prev) => [...prev, { sender: 'You', text: messageValue }]);
      setMessageValue('');
    } else {
      console.warn('WebSocket not ready or empty message.');
    }
  };

  return (
    <div>
      <h1>💬 Chat System</h1>
      <p>Status: {isConnected ? '🟢 Connected' : '⚪ Reconnecting '}</p>
      <form onSubmit={submitMessage}>
        <input
          type="text"
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      <div>
        {messages.length === 0 ? (
          <p>Messages are empty</p>
        ) : (
          messages.map((msg, i) => (
            <p key={i}>
              <strong>{msg.sender}:</strong> {msg.text}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default MainContent;
