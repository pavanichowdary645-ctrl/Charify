# Donation & Charity Platform

A full-stack platform for NGOs to showcase causes, accept donations, and track progress.

## Project Structure
```
VictoryPulse/
├── backend/      # Node.js + Express + MongoDB
└── frontend/     # React
```

## Setup & Run

### Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Features
- 🔐 JWT Auth (Donor & NGO roles)
- 🌍 Browse & search causes by category
- 💰 Donate with optional anonymous mode
- 📊 NGO Dashboard with stats & cause management
- 📈 Real-time progress tracking

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/causes | List all causes |
| GET | /api/causes/:id | Get cause detail |
| POST | /api/causes | Create cause (NGO) |
| PUT | /api/causes/:id | Update cause (NGO) |
| DELETE | /api/causes/:id | Delete cause (NGO) |
| POST | /api/donations | Make a donation |
| GET | /api/donations/cause/:id | Get cause donations |
| GET | /api/donations/ngo/stats | NGO stats |
| GET | /api/ngos | List all NGOs |
