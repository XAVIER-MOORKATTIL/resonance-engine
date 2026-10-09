# ⚡ PROJECT RESONANCE-O
> **Acoustic-Quantum Transducer & Truth-State Verification Engine**

Project RESONANCE-O is a full-stack acoustic analytics web system designed to ingest audio frequency streams (call logs, manager directives, daily voice reports), calculate spectral resonance & decibel voltage, and persist task truth-states in cloud memory via MongoDB Atlas.

---

## ⚡ Tech Stack

* **Backend:** Node.js, Express, Multer, Fast Fourier Transform (FFT) Signal Utilities
* **Database:** MongoDB Atlas Cloud
* **Frontend:** Next.js 16 (App Router), React, Tailwind CSS, Lucide Icons
* **Deployment:** Render (Backend API), Vercel (Frontend Dashboard)

---

## 🚀 Local Development Setup

### Prerequisites
* Node.js v18+
* MongoDB Atlas Cluster URI

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file with MONGO_URI and PORT
npx nodemon server.js

2. Frontend Setup

cd frontend
npm install
npm run dev

Dashboard will be live at http://localhost:3000.
📡 API Endpoints
Method
	
Endpoint
	
Description
GET
	
/api/resonance/health
	
System status check
GET
	
/api/resonance/logs
	
Fetch all transduced wave telemetry
POST
	
/api/resonance/upload
	
Ingest audio wave file & calculate decibel telemetry


---

### Step 3: Update Frontend Config for Production

Before pushing, let us make sure the frontend can read the production API URL dynamically.

Update **`frontend/app/config.js`**:

```javascript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/resonance';
