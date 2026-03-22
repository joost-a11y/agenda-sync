# Frontend Setup & Installation

## Prerequisites
- Node.js 18+
- npm or yarn

## Installation

```bash
cd frontend
npm install
```

## Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Building for Production

```bash
npm run build
```

Optimized build is created in the `dist/` folder.

## Project Structure

- `src/components/` - Reusable React components
- `src/pages/` - Page components (Home, Login, Register, Dashboard)
- `src/services/` - API service layer
- `src/stores/` - Zustand state management
- `src/hooks/` - Custom React hooks

## Features

### Pages
- **Home** - Landing page with sign-up/login links
- **Login** - User login form
- **Register** - User registration form
- **Dashboard** - Main app interface for managing ICS sources

### State Management
- **authStore** - User authentication state
- **icsStore** - ICS sources and sync status

### Services
- **apiClient** - Axios instance with auth interceptor

## Usage

1. Register a new account or login
2. Add ICS calendar feeds (URLs)
3. Click "Sync Now" to synchronize events
4. View sync logs and manage sources from the dashboard

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
```bash
npm run build
# Deploy the dist/ folder
```
