# Jharkhand Societal Innovation & Collaboration Portal
### Government of Jharkhand • JharInnovate: Community to Impact

An AI-powered civic technology platform that connects citizens and community organizations facing grassroots problems with Jharkhand’s premier technical universities, faculty mentors, multidisciplinary student researchers, startups, and industry CSR partners to deliver validated engineering prototypes and measurable societal outcomes.

---

## 🏛️ Project Objective & Overview

This system transforms community problems from passive complaints into structured, validated innovation projects:
- **Citizens** report local challenges with geotagging, photographs, and urgency indicators.
- **Explainable AI** classifies domain focus, flags semantic/geospatial duplicates, and scores priority with an **Emergency Safety Override Rule**.
- **Government Administrators** validate challenges and match them with top-ranked universities using an empirical capability index.
- **Universities (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, BAU)** accept assignments, form multidisciplinary student teams, and use the **AI Proposal Assistant** to structure technical approaches.
- **Industry Partners (e.g. Tata Steel CSR)** pledge grants, laboratory hours, and mentorship.
- **Lifecycle Tracking** monitors the full 10-stage journey through field pilots and citizen outcome verification.

---

## 💻 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React |
| **Maps & GIS** | Leaflet, React-Leaflet with OpenStreetMap (All 24 Jharkhand Districts) |
| **Data Visualization** | Recharts (Domain distribution, lifecycle funnels, district metrics) |
| **Backend** | Python FastAPI, Uvicorn, Pydantic v2 |
| **Database** | SQLAlchemy ORM (zero-configuration SQLite out-of-the-box; switchable to PostgreSQL via `DATABASE_URL`) |
| **Authentication** | Bearer JWT with PBKDF2-HMAC-SHA256 password security and Role-Based Access Control (RBAC) |
| **AI Engines** | Pure-Python explainable TF-IDF vectorization, Cosine similarity, Haversine geospatial proximity, and multi-factor capability matching |
| **Testing** | Pytest, FastAPI TestClient (14 automated unit & integration tests) |

---

## 🔑 Pre-Configured Demo Accounts (1-Click Switcher)

The application includes an instant **One-Click Persona Switcher** on the top navigation bar and login screen:

| Role | Name | Email | Password | Organization |
|---|---|---|---|---|
| **Citizen** | Soma Munda | `citizen@jharkhand.gov.in` | `Citizen@123` | Gram Vikas Samiti, Torpa (Khunti) |
| **University** | Dr. Ananya Roy | `bit.mesra@jharkhand.ac.in` | `Univ@123` | BIT Mesra, Ranchi |
| **Industry CSR** | Sanjay Singhal | `csr@tatasteel.com` | `Industry@123` | Tata Steel Rural Development Society |
| **Govt Admin** | Rajesh Kumar Verma, IAS | `admin@jharkhand.gov.in` | `Admin@123` | Jharkhand State Innovation Council |

---

## 🧠 The 5 Explainable AI Features

### 1. Automatic Problem Categorization
Classifies submissions into 10 official Jharkhand focus domains (*Water Resources, Healthcare, Agriculture, Education, Environment, Renewable Energy, Rural Livelihoods, Accessibility, Urban Infrastructure, Public Administration*) with confidence percentage scores and highlighted domain trigger terms.

### 2. Duplicate Detection
Compares incoming reports against database records using semantic text similarity (TF-IDF cosine similarity) combined with geospatial proximity via the **Haversine formula**. Flagged for human review with similarity percentage and distance in kilometers; never automatically deleted.

### 3. Explainable Challenge Prioritization
Calculates transparent priority scores using a weighted decision matrix:
$$\text{Score} = (\text{Severity} \times 0.25) + (\text{Urgency} \times 0.20) + (\text{Population} \times 0.20) + (\text{Safety} \times 0.20) + (\text{Feasibility} \times 0.15)$$
- **Emergency Safety Override Rule**: If acute contamination (arsenic, fluoride, toxins, collapse) is detected, the challenge is immediately escalated to **Critical (Safety Override)** so life hazards cannot be deprioritized due to engineering complexity.

### 4. AI-Powered University Matching
Empirically evaluates registered Jharkhand institutions (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, Birsa Agricultural University) against:
- Research domain alignment (40%)
- Specialized laboratory & testing facilities (25%)
- Faculty expertise & publications (15%)
- Past verified civic track record (10%)
- Active capacity / available slots (10%)
Returns top 3 institutions with detailed rationale. Administrator approves final assignment.

### 5. AI Proposal Assistant
Generates structured drafts for university teams containing root-cause analysis, recommended technical architecture (e.g. bio-sand filtration + solar IoT telemetry), required multidisciplinary roles, 4-phase milestones, estimated budget, risk mitigations, and societal outcome KPIs. Labeled as an AI draft requiring faculty mentor review.

### 6. सारथी AI (Saarthi AI) Innovation Copilot
Bilingual floating assistant (English & Hindi) powered by domain guardrails, voice input (speech-to-text), audio response narration (text-to-speech), contextual prompt chips, and automatic scope detection to keep discussions focused on Jharkhand's rural challenges.

### 7. Startup Pitch Decks & Investor Meeting Scheduler
Empowers verified grassroots innovations and DPIIT-recognized student startups to publish comprehensive 1-page commercialization decks (traction metrics, unit economics, funding asks) and allows angel investors and CSR funds to schedule 15-minute due diligence video meetings.

### 8. Impact Points & Corporate Goodies Store
Gamified incentivization funded by industrial CSR partners (Tata Steel, CMPDI) where validated citizen problem solvers and student teams redeem impact tokens for IoT hardware kits, engineer gear, and fast-track research internships.

---

## 🔄 Complete 10-Stage Lifecycle Workflow

```
Submitted ──> Under Review ──> Validated ──> Assigned to University ──> Proposal Submitted ──> Proposal Approved ──> In Progress ──> Prototype Testing ──> Pilot/Implementation ──> Outcome Verification ──> Completed
      │              │               │
      └── Rejected   └── Clarify     └── Declined (Reassignment)
```

Every state change records the actor, timestamp, previous status, new status, and official reason in the database `AuditLog`.

---

## 🚀 Quickstart & Execution Guide

### 1. Prerequisites
- Python 3.10+ (Installed at `C:\Users\Agarwal\AppData\Local\Programs\Python\Python312\python.exe`)
- Node.js 18+ (Installed at `C:\Users\Agarwal\AppData\Local\Programs\nodejs`)

### 2. Start the FastAPI Backend
```powershell
cd C:\Users\Agarwal\.gemini\antigravity\scratch\jharkhand-innovation-portal\backend
$env:PYTHONPATH = "C:\Users\Agarwal\.gemini\antigravity\scratch\jharkhand-innovation-portal\backend"
python run_backend.py
```
- Backend runs at: `http://127.0.0.1:8000`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`
- On first start, SQLite database `portal.db` is automatically created and seeded with realistic Jharkhand data!

### 3. Start the React Frontend
```powershell
cd C:\Users\Agarwal\.gemini\antigravity\scratch\jharkhand-innovation-portal\frontend
npm run dev
```
- Frontend runs at: `http://localhost:5173`

### 4. Run Automated Tests
```powershell
cd C:\Users\Agarwal\.gemini\antigravity\scratch\jharkhand-innovation-portal\backend
$env:PYTHONPATH = "C:\Users\Agarwal\.gemini\antigravity\scratch\jharkhand-innovation-portal\backend"
python -m pytest tests/ -v
```
All 14 unit and integration tests pass verifying all 5 AI modules and API routes.

---

## 📊 Demonstration Walkthrough Scenario

1. **Citizen reports issue**: Soma Munda submits *"Unsafe Fluoride Contamination in Village Handpumps"* in Khunti district.
2. **AI enrichment triggers**: System categorizes as *Water Resources* (96% confidence), detects near-duplicates in Torpa, and flags an *Emergency Safety Override* (92.0 score).
3. **Admin Triages & Assigns**: Officer Rajesh Kumar Verma validates the issue, reviews the top 3 AI recommendations, and formally assigns *BIT Mesra*.
4. **University Accepts & Drafts Proposal**: Dr. Ananya Roy accepts assignment, launches the *AI Proposal Assistant*, and forms a multidisciplinary team.
5. **Industry Co-Sponsors**: Tata Steel CSR pledges ₹5,00,000 and testing lab access via the Innovation Marketplace.
6. **Milestones & Testing**: Team uploads lab breakthrough certificates; unit advances to *Prototype Testing* and *Field Pilot*.
7. **Citizen Verifies Outcome**: Citizen tests water, submits 5-star rating confirming fluoride removal (<0.8 mg/L), and project reaches *Completed*.
8. **Export Analytics**: Admin downloads the official CSV report from the 24-district analytics portal.
