import React, { useEffect, useState } from 'react';
import { useICSStore } from '../stores/icsStore';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { sources, fetchSources, addSource, updateSource, deleteSource, syncing, syncNow } = useICSStore();
  const [url, setUrl] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSources();
  }, []);

  const handleAddSource = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addSource(url, displayName);
      setUrl('');
      setDisplayName('');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add source');
    }
    setLoading(false);
  };

  const handleToggle = async (source) => {
    try {
      await updateSource(source.id, { isActive: !source.is_active });
    } catch (error) {
      alert('Failed to update source');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this source?')) {
      try {
        await deleteSource(id);
      } catch (error) {
        alert('Failed to delete source');
      }
    }
  };

  const handleSync = async () => {
    try {
      const result = await syncNow();
      alert(`Sync completed! Created: ${result.totalCreated}, Updated: ${result.totalUpdated}`);
      fetchSources();
    } catch (error) {
      alert(error.response?.data?.error || 'Sync failed');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h2>ICS Calendar Sources</h2>

        <div style={{ backgroundColor: '#f5f5f5', padding: '2rem', marginBottom: '2rem', borderRadius: '8px' }}>
          <h3>Add New Calendar</h3>
          <form onSubmit={handleAddSource}>
            <div style={{ marginBottom: '1rem' }}>
              <label>ICS Feed URL: </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/calendar.ics"
                required
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Display Name: </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Optional name"
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
              {loading ? 'Adding...' : 'Add Source'}
            </button>
          </form>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>

        <h3>Your Calendar Sources</h3>
        {sources.length === 0 ? (
          <p>No calendar sources added yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>URL</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Last Sync</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.75rem' }}>{source.display_name}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#666' }}>{source.url}</td>
                  <td style={{ padding: '0.75rem' }}>{source.is_active ? '✅ Active' : '❌ Inactive'}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                    {source.last_sync_at ? new Date(source.last_sync_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button
                      onClick={() => handleToggle(source)}
                      style={{ marginRight: '0.5rem', padding: '0.5rem 0.75rem', cursor: 'pointer' }}
                    >
                      {source.is_active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDelete(source.id)}
                      style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', backgroundColor: '#f44336', color: 'white' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
