# 🤖 AI Resume Analyzer & Job Alignment System

An AI-powered web application that analyzes resumes, compares them with job descriptions, calculates ATS compatibility, detects skill gaps, and provides actionable improvement suggestions.

---

## 🚀 Features

- ATS compatibility scoring  
- Semantic job alignment  
- Keyword matching  
- Skill gap detection  
- AI-powered feedback & suggestions  
- Resume preview generation  
- Analysis history tracking  
- Secure authentication  

---

## 🏗️ Project Structure

project-root/
│
├── frontend/        # React App
├── backend/         # Node.js API
├── AI-Service/      # FastAPI AI service
└── README.md


---

# ⚙️ Local Setup Guide

## 📌 Prerequisites

Make sure you have installed:

- Node.js (v18+ recommended)
- Python (3.10+ recommended)
- MongoDB Atlas account
- Cloudinary account
- Google Gemini API Key

---

# 🖥️ Backend Setup (Node.js)

### 1. Navigate to the backend directory:
cd backend

### 2. Install dependencies:

npm install
### 3. Set up environment variables

Create a `.env` file:

touch .env

### 4. Add the following variables to `.env`:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

AI_SERVICE_URL=http://localhost:8000

CLIENT_URL=http://localhost:5173

NODE_ENV=development


### 5. Run the backend server:


npm run dev


Backend will run at:


http://localhost:5000


---

# 🧠 AI Service Setup (FastAPI)

### 1. Navigate to AI service directory:


cd AI-Service


### 2. Create virtual environment

**Windows:**


python -m venv venv
venv\Scripts\activate


**Linux / Mac:**


python3 -m venv venv
source venv/bin/activate


### 3. Install dependencies:


pip install -r requirements.txt


### 4. Set up environment variables

Create a `.env` file:


touch .env


Add your Gemini API key:


GEMINI_API_KEY=your_gemini_api_key


### 5. Run the AI service:


uvicorn main:app --reload --port 8000


AI service will run at:


http://localhost:8000


Interactive API docs:


http://localhost:8000/docs


---

# 🌐 Frontend Setup (React + Vite)

### 1. Navigate to frontend directory:


cd frontend


### 2. Install dependencies:


npm install


### 3. Set up environment variables

Create a `.env` file:


touch .env


Add backend API URL:


VITE_API_URL=http://localhost:5000


### 4. Run the frontend:


npm run dev


Frontend will run at:


http://localhost:5173


---

# 🔄 Application Workflow

1. User logs in or registers  
2. Resume file is uploaded  
3. File stored in Cloudinary  
4. Resume text extracted  
5. AI service analyzes content  
6. Scores generated  
7. Results saved to database  
8. User views analysis dashboard  

---

# 📊 Scoring Methodology

## Rule-Based Scoring

- Keyword matching  
- Semantic similarity  
- ATS structure evaluation  

## LLM-Based Scoring (Gemini)

- Overall alignment score  
- Skill gap detection  
- Tone feedback  
- Content suggestions  
- ATS optimization tips  

---

# 📂 Supported File Types

- PDF (.pdf)  
- Word (.doc)  
- Word (.docx)  

Maximum size: 5 MB

---

# 🔐 Authentication

- JWT-based authentication  
- HTTP-only cookies  
- Protected routes  

---

# 📡 API Endpoints

## 👤 User APIs

Register:


POST /api/user/register


Login:


POST /api/user/login


Check Authentication:


GET /api/user/is-auth


Logout:


GET /api/user/logout


---

## 📄 Resume Analysis APIs

Analyze with Job Description:


POST /api/analyze-with-jd


Analyze Resume Only:


POST /api/analyze-resume


---

## 📂 History API

Get past analyses:


GET /api/user/history


---

## 🤖 AI Service APIs

Resume + JD Analysis:


POST /analyze


Resume Only Analysis:


POST /analyze-resume


---

# ☁️ Deployment Guide

## Frontend (Render Static Site)

Build Command:


npm install && npm run build


Publish Directory:


dist


---

## Backend (Render Web Service)

Build Command:


npm install


Start Command:


node server.js


---

## AI Service (Render Web Service)

Build Command:


pip install -r requirements.txt


Start Command:


uvicorn main:app --host 0.0.0.0 --port $PORT


---

# ⚠️ Notes

- Enable cookies in browser  
- Cross-origin credentials required  
- Free hosting may cause cold starts  
- Large files may increase processing time  

---

# 🎯 Future Improvements

- Resume auto-generation  
- Interview preparation suggestions  
- Job recommendations  
- Multi-language support  

---

# 👨‍💻 Author

**Siddharth Zalake**  
Computer Science & Engineering Student  
