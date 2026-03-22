const axios = require('axios');
const ICAL = require('ical.js');

const fetchICSFeed = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ICS feed: ${error.message}`);
  }
};

const parseICS = (icsContent) => {
  try {
    const jcal = ICAL.parse(icsContent);
    const comp = new ICAL.Component(jcal);
    const events = comp.getAllSubcomponents('vevent');

    return events.map((event) => {
      const summary = event.getFirstPropertyValue('summary') || 'Untitled';
      const description = event.getFirstPropertyValue('description') || '';
      const dtstart = event.getFirstPropertyValue('dtstart');
      const dtend = event.getFirstPropertyValue('dtend');
      const uid = event.getFirstPropertyValue('uid');
      const rrule = event.getFirstPropertyValue('rrule');
      const dtstamp = event.getFirstPropertyValue('dtstamp');

      return {
        uid,
        summary,
        description,
        start: dtstart ? dtstart.toJSDate() : null,
        end: dtend ? dtend.toJSDate() : null,
        rrule: rrule ? rrule.toICALString() : null,
        lastModified: dtstamp ? dtstamp.toJSDate() : new Date(),
      };
    });
  } catch (error) {
    throw new Error(`Failed to parse ICS content: ${error.message}`);
  }
};

const getUniqueEvents = (events) => {
  const eventMap = new Map();
  events.forEach((event) => {
    if (event.uid) {
      eventMap.set(event.uid, event);
    }
  });
  return Array.from(eventMap.values());
};

module.exports = {
  fetchICSFeed,
  parseICS,
  getUniqueEvents,
};
