# Getting Started

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file and configure database
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Create .env.local with API URL
npm run dev
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb agenda_sync
```

Server: `http://localhost:5000`
Frontend: `http://localhost:5173`

## Testing the Application

1. **Register Account**: Go to http://localhost:5173/register
2. **Login**: Use your credentials at http://localhost:5173/login
3. **Add ICS Feed**: Enter a valid ICS URL (e.g., https://example.com/calendar.ics)
4. **Sync Events**: Click "Sync Now" to fetch and sync events
5. **View Logs**: Check sync history and event mappings

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agenda_sync
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## Next Steps

1. **OAuth Integration**: Configure Google & Microsoft OAuth
2. **Database Migration**: Deploy to managed PostgreSQL
3. **Deployment**: Deploy backend to Heroku/Railway, frontend to Vercel
4. **Testing**: Add unit and integration tests
5. **Monitoring**: Set up error tracking and logs

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify credentials in .env
- Ensure database exists

### API Connection Error
- Check backend is running on port 5000
- Verify CORS is configured correctly
- Check VITE_API_URL in frontend

### Sync Failures
- Verify ICS URL is valid and accessible
- Check sync logs for detailed error messages
- Ensure calendar authentication tokens are valid
