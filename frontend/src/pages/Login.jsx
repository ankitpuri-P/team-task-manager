import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    setError(''); // Clear any old errors

    try {
      // Send the login data to your backend
      const response = await axios.post('team-task-manager-production-5872.up.railway.app', {
        email,
        password
      });

      // If successful, save the token to the browser's local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      // Redirect the user to the Dashboard!
      navigate('/dashboard');

    } catch (err) {
      // If the backend sends an error (like wrong password), show it to the user
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Team Task Manager</h2>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Error Message Box */}
        {error && <div style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '5px' }}>{error}</div>}

        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;