const axios = require('axios');

class MicrosoftCalendarService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://graph.microsoft.com/v1.0';
  }

  async createEvent(event) {
    try {
      const eventPayload = {
        subject: event.summary,
        bodyPreview: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: 'UTC',
        },
      };

      if (event.rrule) {
        eventPayload.recurrence = {
          pattern: this.parseRRule(event.rrule),
        };
      }

      const response = await axios.post(
        `${this.baseURL}/me/calendar/events`,
        eventPayload,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to create Outlook event: ${error.message}`);
    }
  }

  async updateEvent(eventId, event) {
    try {
      const eventPayload = {
        subject: event.summary,
        bodyPreview: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: 'UTC',
        },
      };

      const response = await axios.patch(
        `${this.baseURL}/me/calendar/events/${eventId}`,
        eventPayload,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to update Outlook event: ${error.message}`);
    }
  }

  async deleteEvent(eventId) {
    try {
      await axios.delete(
        `${this.baseURL}/me/calendar/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );
    } catch (error) {
      throw new Error(`Failed to delete Outlook event: ${error.message}`);
    }
  }

  parseRRule(rruleString) {
    // Simplified RRULE parsing for Microsoft Graph
    // Full implementation would be more complex
    return {};
  }
}

module.exports = MicrosoftCalendarService;
