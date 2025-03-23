'use client';

import {useEffect, useState} from 'react';

export default function Home() {
  
  const [name, setName] = useState('');
  const [people, setPeople] = useState(['Pls wait']);
  const [oldName, setOldName] = useState('');
  const [newNameEl, setNewNameEl] = useState('');
  const [modal, setModal] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null)

  const fetchData = async () => {
    try{
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/home");
      const data = await response.json();
      setPeople(data.people);
    } catch(error){
      console.error('Error Occurred', error)
    } finally{
      setLoading(false);
    }
  }
  const postName = async ()=> {
    try{
      setLoading(true);
      await fetch("http://localhost:8080/api/home", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name})
      })
      fetchData()
    }
    catch(err) {
      console.error('An Error Occurred:', err)
    }
    finally{
      setLoading(false)
    }
  }
  const putName = async()=>{
    try{
      setLoading(true);
      await fetch("http://localhost:8080/api/home/" + oldName, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({newName: newNameEl})
      })
      fetchData();
    }
    catch(error){
      console.error(error)
    }
    finally{
      setLoading(false)
    }
  }
  
  const deleteName = async()=> {
    try{
      await fetch("http://localhost:8080/api/home/" + name , {
      method: 'DELETE'})
      fetchData();
    }
    catch(error){
      console.error(error)
    }
  }
  
  useEffect(() => {
    const ws = new WebSocket("https://localhost:8080");

    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onmessage = (event) => setResponse(event.data);
    ws.onclose = () => console.log("WebSocket Disconnected");

    setSocket(ws);

    return () => ws.close();
  }, []);
  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.error("WebSocket is not connected!");
    }
  };
  

  return (
    <section>
      <div style={{display: 'flex', flexDirection: "column", alignItems: 'start', marginBottom: '10px'}}>
        {people.map((person, index) => {
          
          return(<div key={index} style={{display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <button style={{backgroundColor: 'white', border: 'none', fontSize: '18px', fontWeight: '600' }} onClick={()=>{setModal(person)} } >{person}</button> 
            
            {modal === person && (
              <div>
                <input
                  type="text"
                  placeholder="New Name"
                  onChange={(e) => {
                    setNewNameEl(e.target.value);
                    setOldName(person);
                  }}
                  value={newNameEl}
                />
                <button
                  onClick={() => {
                    putName();
                    setModal('');
                  }}
                >
                  Update
                </button>
                <button onClick={() => setModal('')}>Close</button>
              </div>
            )}

          </div>)
        })}
      </div>

      <form>
        <input type="text" placeholder='Add Name' onChange={(e)=>setName(e.target.value)} value={name}/>
        <button onClick={(e)=>{
          e.preventDefault();
          postName();
          setName('');
        }} >
          {loading ? 'Adding...' : 'Add Name'}
        </button>
        <button onClick={(e)=>{
          deleteName();
          console.log('User Deleted ' + name );
          e.preventDefault();
          setName('');
        }} >
          {loading ? 'Deleting' : 'Delete Name'}
        </button>
      </form>

      <div>
        <h2>WebSocket Chat</h2>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
        <p>Server Response: {response}</p>
      </div>

    </section>
  );
};
