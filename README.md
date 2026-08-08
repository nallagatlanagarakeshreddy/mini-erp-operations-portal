# Mini ERP + CRM Operations Portal

This is a full-stack Mini ERP/CRM system designed for a wholesale/distribution company. It manages customers, products, inventory stock movements, sales challans, purchase orders, invoices, and suppliers. 

The application is built with a **Node.js/Express** backend using **TypeScript** and **Prisma ORM**, connected to a **PostgreSQL** database. The frontend is a modern, responsive **React** application built with **Vite** and **Lucide React** icons.

## Architecture Overview

### Backend (Node.js + Express + Prisma)
- **Layered Architecture**: The backend strictly follows a layered architecture (Routes -> Controllers -> Services) for separation of concerns.
- **Validation**: All incoming requests are strictly validated using `zod`.
- **Database ORM**: `Prisma` is used for type-safe database queries and migrations.
- **Authentication**: JWT-based authentication with Role-Based Access Control (RBAC). Middleware (`requireRole`) restricts endpoints based on roles (ADMIN, SALES, WAREHOUSE, ACCOUNTS).
- **Business Logic**: Complex business flows are wrapped in Prisma Database Transactions (e.g., when a Sales Challan is confirmed, it atomically deducts product stock, logs a stock movement ledger entry, and generates an invoice).

### Frontend (React + Vite)
- **State Management**: React Context API is used for Global Authentication state.
- **Routing**: `react-router-dom` is used with Protected Routes to ensure users must be logged in to view dashboard pages.
- **Styling**: Pure CSS with a modern Glassmorphism UI, CSS variables for theming, and responsive flexbox/grid layouts.
- **API Client**: `axios` is configured with an interceptor to automatically attach the JWT Bearer token to all requests.

## Setup Instructions (Local)

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Running locally or via Docker)

### 1. Database Setup
Ensure PostgreSQL is running. Create a database named `minierp`.

### 2. Backend Setup
```bash
cd backend
npm install

# Configure Environment Variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Apply database migrations and seed the database
npx prisma db push
npx prisma generate
npm run seed

# Start the development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Configure Environment Variables
cp .env.example .env
# Edit .env to set VITE_API_URL=http://localhost:5001/api

# Start the development server
npm run dev
```

## Deployment Instructions

### Option 1: Render (Backend) + Vercel (Frontend)
1. **Database**: Provision a managed PostgreSQL database on Render or Supabase.
2. **Backend**: 
   - Connect your GitHub repo to a Render Web Service.
   - Root directory: `backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm run start`
   - Set Environment Variables: `DATABASE_URL`, `JWT_SECRET`, `PORT=5000`
3. **Frontend**:
   - Connect your GitHub repo to Vercel.
   - Root directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Set Environment Variables: `VITE_API_URL` to your Render backend URL.

### Option 2: Docker Compose
A `docker-compose.yml` file is provided in the root directory for easy deployment of the entire stack (Database, Backend, Frontend).
```bash
docker-compose up -d --build
```

## Test Login Credentials
The seed script automatically generates the following test users (Password for all is `password123`):
- **Admin**: `admin@minierp.com`
- **Sales**: `sales@minierp.com`
- **Warehouse**: `warehouse@minierp.com`
- **Accounts**: `accounts@minierp.com`

## Known Limitations / Incomplete Parts
- **Edit Pages**: The UI pages to Edit an existing Customer or Edit an existing Product are not fully built out (though the backend APIs exist).
- **Pagination UI**: The backend supports pagination and search, but the frontend currently relies heavily on search and displays the first page of results. A frontend pagination component could be added.
- **PDF Export**: Exporting invoices as PDFs (Bonus Requirement) is not implemented in this version.
