import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

export default function OAuthLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/auth/google/url');
      window.location.href = response.data.authUrl;
    } catch (error) {
      alert('Failed to initiate Google login');
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/auth/microsoft/url');
      window.location.href = response.data.authUrl;
    } catch (error) {
      alert('Failed to initiate Microsoft login');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '5rem auto', padding: '2rem', border: '1px solid #ddd' }}>
      <h2>Login with Calendar Provider</h2>
      <p>Connect your Google Calendar or Outlook account</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            padding: '1rem',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          🔵 Login with Google
        </button>

        <button
          onClick={handleMicrosoftLogin}
          disabled={loading}
          style={{
            padding: '1rem',
            backgroundColor: '#0078D4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          ☁️ Login with Microsoft
        </button>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      <p>Or login locally:</p>
      <button
        onClick={() => navigate('/login')}
        style={{
          width: '100%',
          padding: '0.75rem',
          cursor: 'pointer',
        }}
      >
        Email Login
      </button>
    </div>
  );
}
