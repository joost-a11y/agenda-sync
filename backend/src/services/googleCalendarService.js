const axios = require('axios');

class GoogleCalendarService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://www.googleapis.com/calendar/v3';
  }

  async createEvent(event) {
    try {
      const eventPayload = {
        summary: event.summary,
        description: event.description,
        start: { dateTime: event.start.toISOString() },
        end: { dateTime: event.end.toISOString() },
      };

      if (event.rrule) {
        eventPayload.recurrence = [event.rrule];
      }

      const response = await axios.post(
        `${this.baseURL}/calendars/primary/events`,
        eventPayload,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to create Google Calendar event: ${error.message}`);
    }
  }

  async updateEvent(eventId, event) {
    try {
      const eventPayload = {
        summary: event.summary,
        description: event.description,
        start: { dateTime: event.start.toISOString() },
        end: { dateTime: event.end.toISOString() },
      };

      const response = await axios.patch(
        `${this.baseURL}/calendars/primary/events/${eventId}`,
        eventPayload,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to update Google Calendar event: ${error.message}`);
    }
  }

  async deleteEvent(eventId) {
    try {
      await axios.delete(
        `${this.baseURL}/calendars/primary/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );
    } catch (error) {
      throw new Error(`Failed to delete Google Calendar event: ${error.message}`);
    }
  }

  async getCalendarId() {
    try {
      const response = await axios.get(
        `${this.baseURL}/calendars/primary`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );
      return response.data.id;
    } catch (error) {
      throw new Error(`Failed to get Google Calendar ID: ${error.message}`);
    }
  }
}

module.exports = GoogleCalendarService;
