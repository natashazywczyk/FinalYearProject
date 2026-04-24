# CraveControl
A web application designed to support nicotine cessation through self-tracked craving intensity visualisation and personalised accumulative financial monitoring. CraveControl targets users who wish to quit vaping, e-cigarettes, or nicotine pouches, product categories that are largely absent from existing cessation tools. The application is built on Quasar Framework and uses a Supabase database.

All features are accessible from any browser on any device due to its cloud deployement.

---

## Repository Structure
```bash
FinalYearProject/
├── CraveControl/
│   ├── scraper/        # Node.js scrapers for vape and nicotine pouch product data
│   ├── src/            # Frontend components, pages and Supabase handlers
│   └── supabase/       # Database migrations
└── README.md
```

## Project Management

Development tasks, bugs, and feature requests were tracked using 
GitHub Issues and a Kanban board.

[![Project Board](https://img.shields.io/badge/Project-Kanban-blue)](https://github.com/users/natashazywczyk/projects/1)

---

## Local Development
### Prerequisites
- Node.js (v18 or higher)
- Docker Desktop (with hardware virtualisation enabled in BIOS)
- Supabase CLI
- Supabase project with Google OAuth configured

### Setup
1. **Clone the repository.**
```bash
git clone https://github.com/natashazywczyk/FinalYearProject.git
cd CraveControl
```

2. **Install dependencies.**
```bash
npm install
```

3. **Start local Supabase instance.**
```bash
supabase start
```
> Requires Docker Desktop to be running. If Docker fails to start containers, ensure hardware virtualisation (Intel VT-x or AMD-V) is enabled in your system BIOS.

4. **Configure environment variables.**

Create a `.env` file in the `CraveControl` directory:
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

5. **Run the development server.**
```bash
quasar dev
```

The application will run at `http://localhost:9000`.

---

## Deployment
CraveControl is deployed on Vercel. Every push to the main branch triggers an automatic rebuild and redeployment via Vercel's GitHub integration.

Live deployment: [https://cravecontrol.vercel.app](https://cravecontrol.vercel.app/#/)

---

## Screencast
Link to CraveControl screencast: [Screencast](https://atlantictu-my.sharepoint.com/:v:/g/personal/g00415696_atu_ie/IQBwecIiOUhKRq_GteArUzkGAQBX3psayZ76g1QRy1yF6a8?e=84gyL4&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D)
