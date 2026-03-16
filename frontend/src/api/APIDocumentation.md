# 📘 API Documentation  
## AI-Based Resume Analyzer & Job Alignment System

This document describes all backend and AI service APIs used in the system.

---

## 🌐 Base URLs

### Backend (Node.js Express)
https://nodebackend-6xec.onrender.com

### AI Service (FastAPI)

https://aiservice-sx48.onrender.com

---

## 🔐 Authentication

- Cookie-based JWT authentication
- Secure HTTP-only cookies
- Required for protected routes
- Credentials must be included in requests

---

# 👤 USER APIs

### 🟢 Register User

**Endpoint**

```
POST /api/user/register
```

**Request Body**

```json
{
  "name": "Siddharth",
  "email": "sid@example.com",
  "password": "123456"
}
```

**Response**

```json
{
  "success": true,
  "user": {
    "name": "Siddharth",
    "email": "sid@example.com"
  }
}
```

---

### 🟢 Login User

**Endpoint**

```
POST /api/user/login
```

**Description**

Authenticates user and sets session cookie.

**Request Body**

```json
{
  "email": "sid@example.com",
  "password": "123456"
}
```



🟢 Check Authentication

Endpoint

GET /api/user/is-auth

Description

Returns current authenticated user details.

🟢 Logout User

Endpoint

GET /api/user/logout

Description

Clears authentication cookie.

📊 RESUME ANALYSIS APIs
 Analyze Resume WITH Job Description

Endpoint

POST /api/analyze-with-jd

Description

Uploads resume and compares it with a job description.

Content Type

multipart/form-data

| Field          | Type   | Required | Description          |
| -------------- | ------ | -------- | -------------------- |
| resume         | File   | ✅       |PDF/DOC/DOCX resume   |
| jobDescription | String | ✅       | Job description text |
| companyName    | String | ❌       | Company name         |
| jobRole        | String | ❌       | Job role             |

```json
{
  "success": true,
  "analysis": {
    "scores": {
      "keywordMatch": 72,
      "semanticScore": 81,
      "atsScore": 76,
      "alignmentScore": 79,
      "overallScore": 77
    },
    "missingSkills": ["Docker", "AWS"],
    "toneFeedback": "Resume tone is professional but could be more results-oriented.",
    "contentSuggestions": [
      "Add measurable achievements",
      "Include more technical keywords"
    ],
    "atsSuggestions": [
      "Use standard section headings",
      "Avoid tables or images"
    ]
  }
}
```

 Analyze Resume ONLY

Endpoint

POST /api/analyze-resume

Description

Performs general resume analysis without job description.

Form Data

| Field  | Type | Required |
| ------ | ---- | -------- |
| resume | File | ✅       |

📂 HISTORY API
🕘 Get Analysis History

Endpoint

GET /api/user/history

Description

Returns all previous analyses for the logged-in user.

Sample Response
```json
{
  "success": true,
  "history": [
    {
      "_id": "analysis_id",
      "resumeFileName": "resume.pdf",
      "previewImageUrl": "cloudinary_url",
      "scores": {
        "overallScore": 78
      },
      "createdAt": "2026-03-15T12:00:00Z"
    }
  ]
}
```
🤖 AI SERVICE APIs (FastAPI)
🔬 Analyze Resume + Job Description

Endpoint

POST /analyze

Description

Processes resume text and job description using hybrid scoring.

🔬 Analyze Resume Only

Endpoint

POST /analyze-resume

Description

Evaluates resume quality without job description.

