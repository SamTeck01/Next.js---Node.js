'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Signin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      alert(data.message);
      localStorage.setItem('token', data.token);
      router.push('/protected');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Sign In</h1>
      <form onSubmit={handleSignin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;
