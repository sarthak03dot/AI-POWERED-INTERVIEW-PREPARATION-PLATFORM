# AI-Powered Interview Preparation Platform

A high-performance, full-stack monorepo designed to revolutionize technical interview preparation. Leveraging state-of-the-art AI, this platform provides dynamic mock sessions, real-time feedback, and a premium user experience.

## 🚀 Key Features

- **Real-time Notification System**: Stay informed with instant "pusher" toasts and a persistent notification menu managing your 10 most recent updates.
- **AI Mock Interview Sessions**: Participate in stateful, dynamic interview simulations. Our AI persona adapts to your responses and provides a comprehensive technical/behavioral scorecard.
- **Premium UI/UX**: Experience a modern SaaS interface featuring advanced glassmorphism, vibrant color palettes, fluid micro-animations, and a global loading state.
- **Interactive Dashboard**: Track your growth with real-time data integration and dynamic progress charts powered by Recharts.
- **Performance Optimized**: Enjoy lightning-fast initial loads thanks to `React.lazy` code-splitting and optimized vendor chunking (< 500kb per chunk).
- **Secure Authentication**: Robust JWT-based access and refresh token flow for persistent, secure sessions.
- **Daily Challenges**: Maintain your streak and earn XP with high-intensity technical assessments generated daily.

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite), TypeScript, Material-UI 7, Redux Toolkit, Framer Motion, `date-fns`.
- **Backend**: FastAPI, Python 3.13, SQLAlchemy, PostgreSQL/SQLite, JWT Authentication.
- **AI Engine**: DeepSeek Chat API.

## 📦 Project Structure

```text
├── backend/            # FastAPI application, database models, and AI services
└── frontend/           # React application, Redux store, and premium UI components
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.13 or higher)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd "AI-Powered Interview Preparation Platform"
```

### 2. Backend Setup

**For Windows:**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

**For MacOS / Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend` directory:
```env
DEEPSEEK_API_KEY=your_deepseek_api_key
JWT_SECRET=your_super_secret_jwt_key
JWT_ALGO=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_MINUTES=10080
```

**Run the Backend Server:**
```bash
uvicorn app.main:app --reload
# The server will start at http://127.0.0.1:8000
```

### 3. Frontend Setup

Open a new terminal window in the project root.

**For all platforms:**
```bash
cd frontend
npm install
npm run dev
# The frontend will start at http://localhost:5173
```
