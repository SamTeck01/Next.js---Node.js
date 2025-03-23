
import { error } from 'console';
import React from 'react'

export default function home() {

    const socket = new WebSocket('ws://localhost:8080/');

    socket.onopen = ()=>{
      console.log('Connected to websocket server');
    }

    //listen to messages
    socket.onmessage = ({data})=>{
        console.log('Message from server: ', data);
    }
    socket.onerror =()=>{
      
    }
    function sendHello() {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send("hello");
        console.log("📨 Sent: hello");
      } else {
        console.error(error);
      }
    }

  return (
    <div>
      <button onClick={sendHello()}>Send Hello</button>
    </div>
  )
}


