# Pinverse — Pinterest Clone

A full-stack Pinterest-inspired web app for discovering, saving, and sharing visual content. Built with **Next.js**, **Express**, and **MongoDB Atlas**.

## Features

- Responsive masonry grid homepage with infinite scroll
- User registration and JWT authentication
- Create pins with image URLs
- Post detail page with save, like, and comments
- User profiles with created pins
- Search and category filtering
- Smooth hover animations (Framer Motion)

## Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Frontend | Next.js 14, Tailwind CSS, Framer Motion |
| Backend  | Node.js, Express  |
| Database | MongoDB Atlas     |
| Auth     | JWT (Bearer token)|

## Project Structure

```
Pinverse/
├── client/     # Next.js frontend (port 3000)
├── server/     # Express API (port 5000)
├── .env.example
└── README.md
```

## Quick Start

### Easiest — double-click `START.bat`

No MongoDB setup needed for local demo (uses in-memory database).

### Manual setup

**`server/.env`** (optional for Atlas):

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/pinverse?retryWrites=true&w=majority
JWT_SECRET=change-this-to-a-long-random-string
PORT=5000
CLIENT_URL=http://localhost:3000
```

**`client/.env.local`**:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
npm run install:all
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:5000/api/health

### Demo Account

- **Email:** `demo@pinverse.app`
- **Password:** `demo1234`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user (auth) |
| GET | `/api/posts` | List posts (paginated, `?q=`, `?category=`) |
| GET | `/api/posts/:id` | Post detail + comments |
| POST | `/api/posts` | Create post (auth) |
| POST | `/api/posts/:id/save` | Save post (auth) |
| DELETE | `/api/posts/:id/save` | Unsave post (auth) |
| POST | `/api/posts/:id/like` | Toggle like (auth) |
| POST | `/api/posts/:id/comments` | Add comment (auth) |
| GET | `/api/users/:username` | User profile |
| GET | `/api/users/:username/posts` | User's pins |

## Publish to GitHub

See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for step-by-step instructions.

## License

MIT
