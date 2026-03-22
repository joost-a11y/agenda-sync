# Backend Setup & Installation

## Prerequisites
- Node.js 18+
- PostgreSQL 12+

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agenda_sync
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your_secret_key
```

## Database Setup

Ensure PostgreSQL is running and create a database:

```bash
createdb agenda_sync
```

The tables will be automatically created on first server start.

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### ICS Management
- `POST /api/ics/sources` - Add new ICS source
- `GET /api/ics/sources` - List ICS sources
- `PUT /api/ics/sources/:id` - Update ICS source
- `DELETE /api/ics/sources/:id` - Delete ICS source
- `POST /api/ics/sync` - Trigger manual sync
- `GET /api/ics/logs` - Get sync logs

## Database Schema

### users
- id (PK)
- email (unique)
- password_hash
- google_calendar_id
- outlook_calendar_id
- primary_calendar_type
- tokens (encrypted)

### ics_sources
- id (PK)
- user_id (FK)
- url
- display_name
- is_active
- last_sync_at
- next_sync_at

### event_mappings
- id (PK)
- user_id (FK)
- ics_source_id (FK)
- ics_uid
- calendar_event_id
- calendar_type
- synced_at

### sync_logs
- id (PK)
- user_id (FK)
- ics_source_id (FK)
- status
- error_message
- events_created
- events_updated
- synced_at
