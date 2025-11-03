# CraveControl

My final year project to aid those wanting to quit vaping, with financial motivation and craving visualisation through graphs from self tracking.

## Features

- **Quasar Framework**: Modern Vue.js framework with Material Design components
- **Supabase Authentication**: Secure login and user management
- **Web Scraper**: Extract vaping product information (image, title, price)
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Quasar Framework (Vue 3 + Vite)
- **Authentication**: Supabase
- **Web Scraping**: Axios + Cheerio
- **UI Components**: Quasar Material Design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase account and project

## Installation

1. Clone the repository:
```bash
git clone https://github.com/natashazywczyk/CraveControl.git
cd CraveControl
```

2. Install dependencies:
```bash
npm install
```

3. Configure Supabase:
   - Create a Supabase project at https://supabase.com
   - Copy `.env.example` to `.env`
   - Update the `.env` file with your Supabase credentials:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at http://localhost:9000

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
CraveControl/
├── src/
│   ├── boot/              # Boot files (Supabase config)
│   ├── components/        # Reusable Vue components
│   ├── layouts/           # Layout components
│   ├── pages/             # Page components
│   ├── router/            # Vue Router configuration
│   ├── services/          # Services (web scraper, etc.)
│   ├── App.vue            # Root component
│   └── main.js            # Application entry point
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies and scripts
```

## Features Implementation

### Authentication
- Login page with email/password authentication
- Sign up functionality
- Protected routes with authentication guards
- Logout functionality

### Web Scraper
The scraper service (`src/services/scraperService.js`) can:
- Scrape individual product pages for vaping products
- Extract product title, price, and image
- Scrape product listings from category pages
- Provide mock/sample data for testing

**Note**: Direct scraping from the browser may be blocked by CORS. For production use, implement a backend API to handle scraping.

### Sample Products
Click "Load Sample Products" on the Products page to see demo vaping product data.

## Supabase Setup

1. Create a new project in Supabase
2. Enable Email authentication in Authentication settings
3. (Optional) Set up a `profiles` table for user data:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Future Enhancements

- Craving tracking and visualization with graphs
- Financial savings calculator
- Backend API for web scraping (to avoid CORS)
- Data persistence with Supabase database
- Progress tracking and achievements
- Notifications and reminders

## License

ISC
