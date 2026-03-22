const pool = require('../config/database');
const { fetchICSFeed, parseICS, getUniqueEvents } = require('./icsService');
const GoogleCalendarService = require('./googleCalendarService');
const MicrosoftCalendarService = require('./microsoftCalendarService');

class SyncEngine {
  async syncUserSources(userId) {
    const client = await pool.connect();
    try {
      const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];
      const sourcesResult = await client.query(
        'SELECT * FROM ics_sources WHERE user_id = $1 AND is_active = true',
        [userId]
      );

      let totalCreated = 0;
      let totalUpdated = 0;

      for (const source of sourcesResult.rows) {
        try {
          const { created, updated } = await this.syncSource(client, user, source);
          totalCreated += created;
          totalUpdated += updated;

          await client.query(
            'UPDATE ics_sources SET last_sync_at = CURRENT_TIMESTAMP, next_sync_at = CURRENT_TIMESTAMP + INTERVAL \'15 minutes\' WHERE id = $1',
            [source.id]
          );

          await client.query(
            `INSERT INTO sync_logs (user_id, ics_source_id, status, events_created, events_updated)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, source.id, 'success', created, updated]
          );
        } catch (error) {
          console.error(`Error syncing source ${source.id}:`, error);
          await client.query(
            `INSERT INTO sync_logs (user_id, ics_source_id, status, error_message)
             VALUES ($1, $2, $3, $4)`,
            [userId, source.id, 'error', error.message]
          );
        }
      }

      return { totalCreated, totalUpdated };
    } finally {
      client.release();
    }
  }

  async syncSource(client, user, source) {
    const icsContent = await fetchICSFeed(source.url);
    const events = parseICS(icsContent);
    const uniqueEvents = getUniqueEvents(events);

    let created = 0;
    let updated = 0;

    const calendarService = this.getCalendarService(user);

    for (const event of uniqueEvents) {
      const mappingResult = await client.query(
        `SELECT * FROM event_mappings 
         WHERE user_id = $1 AND ics_source_id = $2 AND ics_uid = $3`,
        [user.id, source.id, event.uid]
      );

      if (mappingResult.rows.length === 0) {
        // Create new event
        try {
          const createdEvent = await calendarService.createEvent(event);
          await client.query(
            `INSERT INTO event_mappings (user_id, ics_source_id, ics_uid, calendar_event_id, calendar_type, ics_last_modified)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [user.id, source.id, event.uid, createdEvent.id || createdEvent.id, user.primary_calendar_type, event.lastModified]
          );
          created++;
        } catch (error) {
          console.error(`Failed to create event ${event.uid}:`, error);
        }
      } else {
        // Update existing event
        const mapping = mappingResult.rows[0];
        const lastModified = new Date(mapping.ics_last_modified);

        if (event.lastModified > lastModified) {
          try {
            await calendarService.updateEvent(mapping.calendar_event_id, event);
            await client.query(
              `UPDATE event_mappings SET ics_last_modified = $1, synced_at = CURRENT_TIMESTAMP 
               WHERE id = $2`,
              [event.lastModified, mapping.id]
            );
            updated++;
          } catch (error) {
            console.error(`Failed to update event ${event.uid}:`, error);
          }
        }
      }
    }

    return { created, updated };
  }

  getCalendarService(user) {
    if (user.primary_calendar_type === 'google') {
      return new GoogleCalendarService(user.google_access_token);
    } else if (user.primary_calendar_type === 'outlook') {
      return new MicrosoftCalendarService(user.microsoft_access_token);
    }
    throw new Error('No primary calendar configured');
  }
}

module.exports = new SyncEngine();
