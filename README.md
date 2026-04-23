# CraveControl
My final year project to aid those wanting to quit vaping, with financial motivation and craving visualisation through graphs from self tracking.

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