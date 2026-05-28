# RentFlow - Rental Management System

A web-based rental management system MVP for a 210-unit apartment complex.

## Features

- **Admin Dashboard** — Total units, occupancy, revenue, pending payments, overdue alerts, charts
- **Tenant Management** — Full CRUD, lease tracking, unit assignment, payment history
- **Unit Management** — 210 units across 7 blocks, search/filter by status and type
- **Payment Tracking** — Record payments (M-Pesa, Bank, Cash), auto-balance calculation, receipt generation
- **Maintenance Requests** — Tenant submissions, priority levels, status tracking
- **Feedback System** — Categories, ratings, admin replies
- **Reports** — Monthly income, outstanding balances, vacant units, maintenance stats
- **Tenant Portal** — Balance view, payment history, submit requests/feedback, download receipts
- **Role-Based Access** — Admin, Caretaker, Tenant roles with JWT authentication

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router, Recharts, React Icons |
| Backend | Node.js, Express |
| Database | SQLite (via Sequelize ORM — easily switchable to PostgreSQL) |
| Auth | JWT (JSON Web Tokens) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # Edit with your JWT secret
npm run seed            # Seeds 210 units, 100 tenants, sample payments
npm start               # Runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm start               # Runs on http://localhost:3000
```

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rentflow.co.ke | admin123 |
| Caretaker | caretaker@rentflow.co.ke | caretaker123 |
| Tenant | james.mwangi@email.com | tenant123 |

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/       # JWT authentication middleware
│   ├── models/          # Sequelize models (User, Unit, Tenant, Payment, etc.)
│   ├── routes/          # API routes (auth, tenants, units, payments, etc.)
│   ├── seeders/         # Database seed with 210 units and sample data
│   └── server.js        # Express server entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # React components organized by feature
│       ├── context/     # Auth context provider
│       └── utils/       # API client with axios
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| GET | /api/dashboard | Dashboard stats |
| GET/POST | /api/tenants | List/Create tenants |
| GET/PUT/DELETE | /api/tenants/:id | Get/Update/Remove tenant |
| GET/POST | /api/units | List/Create units |
| GET/PUT | /api/units/:id | Get/Update unit |
| GET/POST | /api/payments | List/Record payments |
| GET | /api/payments/receipt/:id | Payment receipt |
| GET/POST | /api/maintenance | List/Create requests |
| PUT | /api/maintenance/:id | Update request status |
| GET/POST | /api/feedback | List/Submit feedback |
| PUT | /api/feedback/:id | Reply to feedback |
| GET | /api/reports/income | Monthly income report |
| GET | /api/reports/outstanding | Outstanding balances |
| GET | /api/reports/vacant-units | Vacant units report |
| GET | /api/reports/maintenance | Maintenance statistics |
| GET | /api/reports/feedback-stats | Feedback statistics |
