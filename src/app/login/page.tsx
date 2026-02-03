"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && password) {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{padding: 40, maxWidth: 400}}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        required
        style={{display: 'block', marginBottom: 20, width: '100%'}}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        required
        style={{display: 'block', marginBottom: 20, width: '100%'}}
      />
      <button type="submit">Login</button>
    </form>
  );
}
