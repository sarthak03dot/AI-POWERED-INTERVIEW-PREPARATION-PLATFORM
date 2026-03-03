# AI-Powered Interview Preparation Platform

A full-stack platform designed to help users prepare for technical interviews through AI-generated questions, real-time feedback, and progress tracking.

## Features
- **Authentication**: Secure JWT-based access and refresh token flow (bypassing passlib limits).
- **Interactive Dashboard**: Track your overall progress, scores, and topics using dynamic React Recharts.
- **Daily Challenges**: Complete a daily interview question to maintain your streak and earn points.
- **Custom Interviews**: Generate on-demand mock interviews (General, HR, Coding, System Design) powered by DeepSeek AI.
- **History Tracking**: Review past answers and scores with paginated interview history.

## Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Material-UI, Redux Toolkit, React Hook Form, Axios.
- **Backend**: FastAPI, Python 3.13, SQLAlchemy, PostgreSQL/SQLite, JWT Authentication, bcrypt.
- **AI Integration**: DeepSeek Chat API.

## Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.10 or higher)
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
Create a `.env` file in the `backend` directory with the following variables:
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

Open a new terminal window/tab from the project root.

**For Windows, MacOS, and Linux:**
```bash
cd frontend
npm install
npm run dev
# The frontend will start at http://localhost:5173
```
