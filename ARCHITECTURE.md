# Agenda Sync - Technical Architecture

## Overview

Agenda Sync is a calendar synchronization platform that pulls events from multiple ICS (iCalendar) feeds and merges them into a single primary calendar (Google Calendar or Outlook 365).

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Web App)                       │
│         React/Vue - Dashboard & Configuration               │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   Backend API Server                         │
│         Node.js/Express - REST API & Sync Logic             │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼───┐   ┌─────▼──────┐  ┌───▼────────┐
   │Database │   │Google Cal  │  │Outlook/MS  │
   │(PostgreSQL)  │   API      │  │Graph API   │
   └────────┘   └────────────┘  └────────────┘
        │
   ┌────▼──────────────┐
   │ICS Feed Sources    │
   │(External URLs)     │
   └───────────────────┘
```

## Data Model

### Core Tables

1. **users**
   - id (PK)
   - email
   - google_calendar_id (nullable)
   - outlook_calendar_id (nullable)
   - primary_calendar_type (enum: google, outlook)
   - oauth_tokens (encrypted)

2. **ics_sources**
   - id (PK)
   - user_id (FK)
   - url
   - display_name
   - is_active
   - last_sync_at
   - next_sync_at

3. **event_mappings**
   - id (PK)
   - user_id (FK)
   - ics_source_id (FK)
   - ics_uid (unique identifier from ICS)
   - calendar_event_id (Google/Outlook event ID)
   - last_modified (ICS)
   - synced_at

4. **sync_logs**
   - id (PK)
   - user_id (FK)
   - ics_source_id (FK)
   - status (success/error)
   - error_message
   - events_created
   - events_updated
   - events_deleted
   - synced_at

## Sync Algorithm

### Step 1: Fetch ICS Feed
- Retrieve ICS file from configured URL
- Parse iCalendar format
- Validate structure

### Step 2: Parse Events
- Extract all VEVENT components
- Map UID, DTSTART, DTEND, SUMMARY, DESCRIPTION
- Handle recurrence rules (RRULE)

### Step 3: Duplicate Detection
- Query event_mappings table for existing ICS UID
- Compare last modified timestamp
- Determine if create, update, or skip

### Step 4: Calendar Operations
- **Create**: POST to calendar API with event details
- **Update**: PATCH existing event if properties changed
- **Delete**: Handle orphaned events (if source removed)
- **Skip**: No changes needed

### Step 5: Store Mapping
- Record ICS UID → Calendar Event ID mapping
- Update sync metadata
- Log operation

## API Integrations

### Google Calendar API
- Endpoint: `https://www.googleapis.com/calendar/v3`
- Auth: OAuth 2.0
- Methods: events.insert, events.update, events.delete, events.list

### Microsoft Graph API
- Endpoint: `https://graph.microsoft.com/v1.0`
- Auth: OAuth 2.0
- Methods: /me/calendar/events (CRUD operations)

## MVP Scope

✅ User authentication (OAuth)
✅ Add/edit/remove ICS URLs
✅ Fetch and parse ICS feeds
✅ Create events in primary calendar
✅ Prevent duplicates with UID mapping
✅ Sync status dashboard

## Advanced Features (Post-MVP)

- Event deletion handling
- Recurring event improvements
- Conflict resolution
- Rate limit handling
- Webhook support for ICS changes
- Event filtering by calendar
- Custom event coloring
- Timezone handling
- Undo/restore deleted events

## Edge Cases & Considerations

1. **Duplicates**: Prevent via ICS UID mapping
2. **Updates**: Compare modification timestamps
3. **Deletions**: Soft delete with recovery option
4. **Rate Limits**: Implement exponential backoff
5. **Recurring Events**: Store original RRULE, create series
6. **Timezones**: Normalize to UTC, display in user timezone
7. **Large Feeds**: Paginate, implement batch processing
8. **Failed Syncs**: Retry logic with exponential backoff

## Deployment & Scalability

- **Frontend**: Vercel/Netlify
- **Backend**: Docker + Kubernetes / AWS ECS
- **Database**: PostgreSQL (managed)
- **Queue**: Bull/RabbitMQ for sync jobs
- **Cache**: Redis for rate limiting & session management
