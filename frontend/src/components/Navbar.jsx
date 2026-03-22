import React from 'react';
import { useAuthStore } from '../stores/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav style={{ backgroundColor: '#333', padding: '1rem', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>📅 Agenda Sync</h1>
        {user && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <span>{user.email}</span>
            <button onClick={logout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
