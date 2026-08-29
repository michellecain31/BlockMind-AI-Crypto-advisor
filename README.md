# 🧠 BlockMind — AI Crypto Advisor

<div align="center">

### A personalized crypto dashboard powered by AI

**Track the market. Discover relevant content. Get insights tailored to you.**

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7)](https://render.com/)

###  [Live Demo](https://block-mind-ai-crypto-advisor.vercel.app)

</div>

---

##  About BlockMind

**BlockMind** is a personalized AI-powered crypto investor dashboard.

Instead of showing every user the same information, BlockMind creates a dashboard experience based on the user's selected crypto assets, investor style, and preferred types of content.

After completing a short onboarding process, users receive a personalized dashboard containing:

-  Relevant crypto market news
-  Live cryptocurrency prices and 24-hour market movement
-  A personalized AI-generated daily insight
-  A dynamic crypto meme
- 👍👎 Feedback controls that can be used to improve future recommendations

The goal is to create a clean, useful and personalized crypto experience while demonstrating how user preferences and feedback can support future recommendation-model improvements.

---

##  Live Application

| Service | URL |
|---|---|
| **Frontend** | [block-mind-ai-crypto-advisor.vercel.app](https://block-mind-ai-crypto-advisor.vercel.app) |
| **Backend API** | [blockmind-api.onrender.com](https://blockmind-api.onrender.com) |
| **API Health Check** | [blockmind-api.onrender.com/health](https://blockmind-api.onrender.com/health) |

> The backend is hosted on Render's free tier, so the first request after a period of inactivity may take a few seconds while the service wakes up.

---

##  Main Features

###  Authentication

Users can create an account and securely log in to BlockMind.

Authentication includes:

- User registration
- Login
- Password hashing
- JWT-based authentication
- Protected frontend routes
- Backend authentication middleware

---

###  Personalized Onboarding

After signing up, users complete a short onboarding flow.

The onboarding collects:

**Crypto Assets**
- Bitcoin
- Ethereum
- Solana
- Dogecoin
- and additional searchable assets

**Investor Style**
-  HODLer
-  Day Trader
-  NFT Collector

**Content Preferences**
- Market News
- Charts
- Social
- Fun

These preferences are stored in MongoDB and are used to personalize the user's dashboard and AI-generated content.

---

##  Personalized Dashboard

The main dashboard combines several independent data sources into one personalized experience.

###  Market News

Displays current crypto-related news using a public crypto news feed.

Users can:

- View recent headlines
- Open the original article
- Give positive or negative feedback

###  Market Watch

Displays live cryptocurrency market information for the user's selected assets.

Data includes:

- Current USD price
- 24-hour percentage change
- Personalized asset selection

Users can also search for and add additional cryptocurrencies.

###  Coin Details

Selecting a cryptocurrency opens a dedicated coin page containing:

- Current price
- Market capitalization
- Market-cap rank
- 24-hour high
- 24-hour low
- 24-hour price change

Coin data is cached on the backend to reduce unnecessary external API calls and improve reliability.

###  AI Insight of the Day

BlockMind generates a personalized daily crypto insight based on:

- Selected crypto assets
- Investor style
- Content preferences

The generated content is designed to be educational and descriptive rather than financial advice.

AI responses are validated before being displayed. If the AI provider is temporarily unavailable or returns an invalid response, BlockMind can provide a safe fallback instead of breaking the dashboard.

Generated insights are stored in MongoDB so a valid daily insight does not need to be regenerated on every dashboard request.

###  Crypto Meme

The dashboard also includes a fun crypto meme selected dynamically from a curated collection.

The meme changes as the dashboard content updates and provides a lighter component alongside market information.

---

##  Feedback System

Users can vote on dashboard content using **thumbs up 👍 or thumbs down 👎**.

Feedback is currently supported for:

- AI insights
- Crypto memes
- Market news
- Coin-price content

Each feedback record is associated with the authenticated user and the relevant content.

This creates a foundation for future recommendation improvements based on actual user behavior rather than preferences alone.

---

##  Future Recommendation & Training Process

The current version stores user feedback but does not train a machine-learning model directly.

A future recommendation pipeline could use the stored feedback as follows:

1. Combine each user's onboarding preferences with their historical feedback.
2. Associate positive and negative votes with content type, assets and content metadata.
3. Convert those interactions into preference signals.
4. Use the signals to rank future dashboard content.
5. Evaluate recommendation quality using separate training and validation datasets.
6. Continuously update user preference weights as additional feedback is collected.

For example, repeated positive feedback on Ethereum market news could increase the ranking of similar ETH-related content for that user.

Negative feedback would be treated as a signal rather than an absolute rule, since individual dislikes may be noisy or context-dependent.

This approach could later support ranking models, recommendation algorithms or improved AI prompt personalization.

---

##  Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide Icons

### Backend

- Node.js
- Express
- TypeScript
- JWT Authentication
- REST API

### Database

- MongoDB Atlas
- Mongoose

### External Services

- **CoinGecko API** — cryptocurrency prices, search and coin details
- **CoinDesk RSS** — crypto market news
- **OpenRouter** — AI-generated personalized insights

### Deployment

- **Vercel** — frontend
- **Render** — backend API
- **MongoDB Atlas** — cloud database

---

##  Architecture

```text
┌──────────────────────┐
│      React Client    │
│   Vite + TypeScript  │
└──────────┬───────────┘
           │
           │ HTTPS / REST API
           ▼
┌──────────────────────┐
│   Express Backend    │
│      TypeScript      │
├──────────────────────┤
│ Authentication       │
│ Personalization      │
│ Market Services      │
│ AI Insight Service   │
│ Feedback System      │
└───────┬──────────────┘
        │
        ├──────────────► CoinGecko
        │
        ├──────────────► CoinDesk
        │
        ├──────────────► OpenRouter
        │
        ▼
┌──────────────────────┐
│    MongoDB Atlas     │
│                     │
│ Users               │
│ AI Insights         │
│ Feedback            │
└──────────────────────┘
```

---

##  Project Structure

```text
BlockMind-AI-Crypto-advisor/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   └── package.json
│
├── .gitignore
└── README.md
```

---

##  Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/michellecain31/BlockMind-AI-Crypto-advisor.git
cd BlockMind-AI-Crypto-advisor
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173

OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free

COINGECKO_API_KEY=your_coingecko_api_key
```

Start the backend:

```bash
npm run dev
```

The backend will run locally on:

```text
http://localhost:5050
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5050/api
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

##  Environment & Security

Sensitive credentials are stored using environment variables and are **not committed to GitHub**.

The repository's `.gitignore` excludes:

```text
.env
.env.*
node_modules/
dist/
.DS_Store
__MACOSX/
```

Example environment files may be included without real credentials.

---

##  API Reliability & Caching

External free-tier APIs can enforce request limits.

To reduce unnecessary requests, BlockMind uses backend caching for cryptocurrency market data and coin details.

The CoinGecko integration also uses an API key stored securely as a backend environment variable.

This helps:

- Reduce repeated API requests
- Improve dashboard response time
- Reduce rate-limit errors
- Provide cached data when appropriate

---

##  AI Development Process

AI-assisted development tools were used during the implementation of BlockMind.

### ChatGPT

ChatGPT was used as a development assistant for:

- Reviewing the task requirements
- Planning the application architecture
- Debugging TypeScript and backend issues
- Reviewing authentication and protected-route behavior
- Designing the AI personalization flow
- Debugging external API rate limits
- CORS and deployment troubleshooting
- Reviewing responsive UX
- Deployment guidance for Vercel, Render and MongoDB Atlas
- Final requirement and code review

### Cursor

Cursor was used during implementation for:

- Code navigation
- Editing and refactoring
- TypeScript development
- Component and service implementation
- Reviewing project structure

AI-generated suggestions were reviewed and tested during development rather than being used without validation.

The project was repeatedly verified through local builds, browser testing, deployment logs and production testing.

---

##  Database

MongoDB Atlas stores the application's persistent data, including:

- User accounts
- Onboarding preferences
- AI-generated daily insights
- User feedback

Database credentials are intentionally **not included in this public repository**.

Reviewer database access can be provided separately using restricted credentials.

---

##  Disclaimer

BlockMind is a coding project.

Crypto market information and AI-generated insights displayed by the application are provided for informational and educational purposes only and should **not be considered financial advice**.

---

## 👩 Author

**Michelle Cain**

Built as part of the **Moveo AI Crypto Advisor Coding Task**.

---

<div align="center">

### 🧠 BlockMind

**Your crypto interests. Your dashboard. Your insight.**

</div>