'use client';
import React, { useState, useEffect, useRef } from 'react';

const MainContent = ({ ws }) => {
  const [messages, setMessages] = useState([]);
  const [messageValue, setMessageValue] = useState('');

  // Fetch old messages once
  async function fetchMessage() {
      try {
        const response = await fetch('http://localhost:8080/messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.log('An error occurred', error);
      }
    }
  useEffect(() => {
    fetchMessage();
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onopen = () => console.log('✅ WebSocket connected');

    ws.current.onmessage = (event) => {
      const newMessage = event.data;
      setMessages((prev) => [...prev, { sender: 'Server', text: newMessage }]);
    };

    ws.current.onerror = (err) => console.error('❌ WebSocket Error:', err);

    return () => {
      ws.current.close();
    };
  }, [ws]);

  const submitMessage = (e) => {
    e.preventDefault();
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(messageValue);
      setMessageValue('');
    } else {
      console.error('WebSocket is not connected');
    }
    fetchMessage();
  };

  return (
    <div>
      <h1>💬 Chat System</h1>
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

const Home = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8080');
  }, []);

  return <MainContent ws={socketRef} />;
};

export default Home;



{/*'use client'
import React, { useState, useEffect } from 'react';

const MainContent = ({ws}) => {
  const [messages, setMessages] = useState([]);
  const [messageValue, setMessageValue] = useState('');

  
  useEffect(()=> {
    async function fetchMessage () {
      try {
        const response = await fetch('http://localhost:8080/messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.log('An error occurred', error);
      }
    };fetchMessage(); 
    
  }, []);
  
  useEffect(() => {
    if (ws) {
      ws.onopen = () => console.log('Connected Successfully');
      ws.onmessage = (event) => {
        const newMessage = event.data;
        console.log(newMessage);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'Server', text: newMessage },
        ]);
      };
      ws.onerror = (err) => console.error('WebSocket Error:', err);
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const submitMessage = (event) => {
    event.preventDefault();
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log(ws.readyState);
      console.log(messageValue)
      ws.send(messageValue);
      setMessageValue('');
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return (
    <div>
      <h1>Chat System</h1>
      <form onSubmit={submitMessage} style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={messageValue}
          onChange={(e)=> setMessageValue(e.target.value)}
        />
        <input type="submit" value="Send" />
      </form>

      <div>
        {messages.length === 0 && <p>Messages is empty</p>}
        {messages ? messages.map((message, index) => (
          <p key={index}>
            
            <strong>{message.sender}: </strong>
            {message.text}
          </p>
        )) :  <p>Messages Loading</p> }
      </div>
    </div>
  );
}


const Home=()=> { 
  const ws = new WebSocket('ws://localhost:8080');
  ws === new WebSocket('ws://localhost:8080') && console.log('successfully connected');
  return (<>
      <MainContent ws={ws}/>
  </>)
}
export default Home;*/}