# Agenda Sync

A web application that allows users to add one or more ICS calendar URLs and synchronize their events directly into a selected primary calendar (Google Calendar or Outlook 365).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Google/Microsoft OAuth apps (optional for local dev)

### 1. Clone & Setup
```bash
git clone https://github.com/joost-a11y/agenda-sync.git
cd agenda-sync

# Backend
cd backend
npm install
cp .env.example .env  # Edit with your database credentials

# Frontend
cd ../frontend
npm install
```

### 2. Database
```bash
createdb agenda_sync
```

### 3. Run Locally
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173`

## ✨ Features

- ✅ Add, edit, and remove ICS calendar URLs
- ✅ Select primary calendar (Google Calendar or Outlook 365)
- ✅ OAuth authentication (Google / Microsoft)
- ✅ Automatic event synchronization
- ✅ Duplicate prevention using ICS UID mapping
- ✅ Support for recurring events
- ✅ Event mapping between ICS feeds and primary calendar
- ✅ Sync status dashboard with logs

## 📋 Project Structure

```
agenda-sync/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── config/       # Database & schema
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth, CORS, etc
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── index.js      # Server entry point
│   └── package.json
│
├── frontend/          # React/Vite application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client
│   │   ├── stores/       # Zustand state management
│   │   └── App.jsx       # Main app component
│   └── package.json
│
├── ARCHITECTURE.md    # System design & data model
├── GETTING_STARTED.md # Local development setup
├── OAUTH_SETUP.md     # OAuth configuration
├── OAUTH_QUICK_START.md # Quick OAuth guide
├── BACKEND_SETUP.md   # Backend API reference
├── FRONTEND_SETUP.md  # Frontend setup
└── DEPLOYMENT.md      # Production deployment
```

## 🔐 OAuth Setup

Agenda Sync supports two calendar providers:

### Google Calendar
1. [Set up Google OAuth](OAUTH_SETUP.md#google-oauth-setup)
2. Get Client ID & Secret
3. Add to backend `.env`

### Microsoft Outlook
1. [Set up Microsoft OAuth](OAUTH_SETUP.md#microsoft-oauth-setup)
2. Get Client ID & Secret
3. Add to backend `.env`

For quick setup, see [OAUTH_QUICK_START.md](OAUTH_QUICK_START.md)

## 🛠️ Technology Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + OAuth2
- **Calendar APIs**: Google Calendar v3, Microsoft Graph v1.0
- **ICS Parsing**: ical.js

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State**: Zustand
- **Routing**: React Router
- **HTTP**: Axios

### Deployment
- Backend: Railway, Heroku, AWS, or any Node.js host
- Frontend: Vercel, Netlify, GitHub Pages
- Database: PostgreSQL (managed or self-hosted)

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, data model, sync algorithm |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Local development guide |
| [OAUTH_SETUP.md](OAUTH_SETUP.md) | Detailed OAuth configuration |
| [OAUTH_QUICK_START.md](OAUTH_QUICK_START.md) | 5-minute OAuth setup |
| [BACKEND_SETUP.md](BACKEND_SETUP.md) | Backend API reference |
| [FRONTEND_SETUP.md](FRONTEND_SETUP.md) | Frontend development guide |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide |

## 🔄 Sync Algorithm

1. **Fetch**: ICS feed from configured URL
2. **Parse**: Extract events from iCalendar format
3. **Detect Duplicates**: Match ICS UID with existing events
4. **Create/Update**: Push new/modified events to calendar
5. **Log**: Record sync results and errors

## 📊 API Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google/url` - Get Google OAuth URL
- `GET /api/auth/microsoft/url` - Get Microsoft OAuth URL
- `GET /api/auth/profile` - Get user profile (protected)

### Calendar Sources
- `GET /api/ics/sources` - List all sources
- `POST /api/ics/sources` - Add new source
- `PUT /api/ics/sources/:id` - Update source
- `DELETE /api/ics/sources/:id` - Delete source
- `POST /api/ics/sync` - Trigger manual sync
- `GET /api/ics/logs` - View sync logs

## 🚢 Deployment

### Quick Deploy

**Backend** (Railway):
1. Connect GitHub repo to Railway
2. Set environment variables
3. Done! (auto-deploy on git push)

**Frontend** (Vercel):
1. Import GitHub repo to Vercel
2. Set `VITE_API_URL` environment variable
3. Done!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection error | Ensure PostgreSQL is running and credentials are correct |
| API 404 errors | Verify backend is running on port 5000 |
| OAuth redirect fails | Check redirect URIs in Google/Microsoft console |
| Sync not working | Verify calendar permissions are granted |

## 🤝 Contributing

Pull requests welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Submit a pull request

## 📝 License

MIT - See LICENSE file for details

## 🎯 Roadmap

- [ ] Event deletion handling
- [ ] Advanced recurring event support
- [ ] Conflict resolution
- [ ] Webhook support for real-time sync
- [ ] Event filtering and categorization
- [ ] Custom event coloring
- [ ] Timezone handling improvements
- [ ] Rate limiting & caching
- [ ] Mobile app (React Native)
- [ ] Calendar sharing between users

## 📞 Support

- 📖 Check [documentation](.)
- 🐛 [Report issues](https://github.com/joost-a11y/agenda-sync/issues)
- 💬 [Discussions](https://github.com/joost-a11y/agenda-sync/discussions)

---

**Made with ❤️ by the Agenda Sync team**
