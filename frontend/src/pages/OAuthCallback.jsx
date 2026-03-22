import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setUser({ email: 'user@example.com' }); // Will be fetched properly on next load
      navigate('/dashboard');
    } else {
      const error = searchParams.get('error');
      if (error) {
        alert('OAuth failed. Please try again.');
      }
      navigate('/login');
    }
  }, [token, navigate, setUser]);

  return <div>Processing OAuth...</div>;
}
