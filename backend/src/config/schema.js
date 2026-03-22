const pool = require('./database');

const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        google_calendar_id VARCHAR(255),
        outlook_calendar_id VARCHAR(255),
        primary_calendar_type VARCHAR(50),
        google_access_token TEXT,
        google_refresh_token TEXT,
        microsoft_access_token TEXT,
        microsoft_refresh_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ics_sources (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        url VARCHAR(500) NOT NULL,
        display_name VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        last_sync_at TIMESTAMP,
        next_sync_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, url)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_mappings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ics_source_id INTEGER NOT NULL REFERENCES ics_sources(id) ON DELETE CASCADE,
        ics_uid VARCHAR(500) NOT NULL,
        calendar_event_id VARCHAR(255),
        calendar_type VARCHAR(50),
        ics_last_modified TIMESTAMP,
        synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, ics_source_id, ics_uid)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sync_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ics_source_id INTEGER NOT NULL REFERENCES ics_sources(id) ON DELETE CASCADE,
        status VARCHAR(50),
        error_message TEXT,
        events_created INTEGER DEFAULT 0,
        events_updated INTEGER DEFAULT 0,
        events_deleted INTEGER DEFAULT 0,
        synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

module.exports = { initializeDatabase };
