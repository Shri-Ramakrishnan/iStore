# iStore - MERN E-commerce (Apple-inspired iPhone Store)

A full MERN stack e-commerce application that sells only Apple iPhones (UI inspired by Apple, no trademark assets). It includes authentication, cart, checkout (dummy payment), admin dashboard, and seeded iPhone products.

## Tech
- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt

## Setup
1. Install dependencies
   - `npm run install:all`
2. Configure environment
   - Server: `server/.env` (already provided with local defaults)
   - Client: `client/.env` (already provided)
3. Seed sample products (optional)
   - `npm run seed`
4. Run dev servers
   - `npm run dev`

Frontend: http://localhost:5173
Backend:  http://localhost:5000

## Accounts
- Register a new user via the Signup page.
- To create an admin, set `role: "admin"` for a user in MongoDB (or update the DB manually).

## Scripts
- `npm run dev` - runs both client and server
- `npm run seed` - seeds products into MongoDB
- `npm run install:all` - installs both client and server dependencies

## Notes
- Dummy payment flow only (no real gateway).
- Apple-style UI with minimal white/grey palette.
