import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>📅 Welcome to Agenda Sync</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
        Synchronize multiple ICS calendar feeds into your primary calendar
      </p>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <Link to="/login">
          <button style={{ padding: '1rem 2rem', fontSize: '1rem', cursor: 'pointer' }}>
            Login
          </button>
        </Link>
        <Link to="/register">
          <button style={{ padding: '1rem 2rem', fontSize: '1rem', cursor: 'pointer' }}>
            Sign Up
          </button>
        </Link>
      </div>

      <div style={{ marginTop: '4rem', textAlign: 'left', maxWidth: '600px', margin: '4rem auto' }}>
        <h2>Features</h2>
        <ul>
          <li>Add multiple ICS calendar feeds</li>
          <li>Sync events to Google Calendar or Outlook</li>
          <li>Prevent duplicate events automatically</li>
          <li>Keep calendars in sync with scheduled updates</li>
          <li>Easy management dashboard</li>
        </ul>
      </div>
    </div>
  );
}
