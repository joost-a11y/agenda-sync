const pool = require('../config/database');
const syncEngine = require('../services/syncEngine');

const addICSSource = async (req, res) => {
  const { url, displayName } = req.body;
  const userId = req.user.id;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO ics_sources (user_id, url, display_name) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userId, url, displayName || url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'ICS source already added' });
    }
    res.status(500).json({ error: error.message });
  }
};

const getICSSources = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM ics_sources WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateICSSource = async (req, res) => {
  const { id } = req.params;
  const { url, displayName, isActive } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `UPDATE ics_sources 
       SET url = COALESCE($1, url), 
           display_name = COALESCE($2, display_name),
           is_active = COALESCE($3, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [url, displayName, isActive, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ICS source not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteICSSource = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM ics_sources WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ICS source not found' });
    }

    res.json({ message: 'ICS source deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const syncNow = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await syncEngine.syncUserSources(userId);
    res.json({ message: 'Sync completed', ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSyncLogs = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM sync_logs 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addICSSource,
  getICSSources,
  updateICSSource,
  deleteICSSource,
  syncNow,
  getSyncLogs,
};
