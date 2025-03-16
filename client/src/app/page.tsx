'use client';

import {useEffect, useState} from 'react';

export default function Home() {
  
  const [name, setName] = useState('');
  const [deleteNameEl, setDeleteNameEl] = useState('')
  const [people, setPeople] = useState(['Pls wait']);

  const fetchData = () => {
    fetch("http://localhost:8080/api/home").then(
      response => response.json()
    ).then(data => {
      setPeople(data.people)
    })  
  }
  const postName =()=> {
    fetch("http://localhost:8080/api/home", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name})
    }).then(response => response.json()).then().catch(err => console.log('An Error Occurred:', err))
  }
  const deleteName =()=> {
    fetch("http://localhost:8080/api/home/" + deleteNameEl , {
      method: 'DELETE',
    }).then(response => response).then()
      .catch(err => console.log('An error occurred:', err))
  }
  
  useEffect(()=>{
    setInterval(()=> fetchData(), 1000)
  }, [])

  return (
    <section>
      {people.map((person, index) => <p key={index}>{person}</p>)} 
      <form>
        <input type="text" placeholder='Add Name' onChange={(e)=>setName(e.target.value)} value={name}/>
        <button onClick={(e)=>{
          e.preventDefault();
          postName();
          setName('');
        }} >Add Name</button>
        <button onClick={(e)=>{
          deleteName();
          console.log('User Deleted ' + deleteNameEl );
          e.preventDefault();
          setDeleteNameEl('');
        }} >Delete Name</button>
      </form>
    </section>
  );
};
