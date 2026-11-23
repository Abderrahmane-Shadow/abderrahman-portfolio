# Premium Personal Portfolio & CMS – Abderrahman El Harakani
### Data Scientist | AI Engineer | Data Analyst

A modern, responsive personal portfolio website and Content Management System (CMS) engineered with **React 18**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

Designed for **Abderrahman El Harakani**, Data Science & AI Engineer actively seeking a **4–6 month End-of-Studies Internship (PFE) for 2027**.

---

## 🌟 Key Features

### 🎨 Public Portfolio Experience
- **Hero & Identity**: Professional portrait branding, dynamic availability status, and trilingual copy.
- **Multilingual Support**: Full support for English, French, and Arabic (with authentic RTL layout support).
- **Theme Modes**: Seamless Light and Dark mode switching with persistent user preference.
- **Project Showcase**: Filterable portfolio gallery with tags, GitHub and live demo links, and detailed project modals.
- **Technical Skills**: Categorized technical competencies across Programming, Machine Learning, Deep Learning, Generative AI & LLMs, Data Analytics, and Cloud/DevOps.
- **Academic Background**: Education timeline detailing academic milestones and engineering pillars at École Normale Supérieure (ENS), Tétouan.
- **Resume / CV Download**: Integrated PDF download with real-time download analytics tracking.
- **Visitor Contact**: Functional contact form with immediate inquiry dispatch to database and direct email channels.

### 🛡️ Private Admin Dashboard & CMS
- **Secure Authentication**: Protected `/admin` routes requiring authenticated Supabase session with Row Level Security (RLS) enforcement.
- **Real-Time Analytics**:
  - **Website Visitor Analytics**: Anonymous unique visitor tracking, page views, and path popularity.
  - **CV Download Analytics**: Accurate event-based download metrics and daily trends.
- **Direct Image Uploads**: Upload project screenshots and assets directly to Supabase Storage (`portfolio_assets` bucket) from your computer.
- **Profile Manager**: Edit trilingual identity, titles, role taglines, location, bio, and PFE availability badges.
- **Projects Manager**: Create, edit, reorder, feature, and publish projects dynamically.
- **Skills & Education Managers**: Update technical categories, skills, and academic degrees.
- **Visitor Inquiries Inbox**: Review submitted contact messages with read/unread statuses.

---

## 🗄️ Supabase Setup & Database Migrations

### 1. Create a Supabase Project
1. Create a free project at [https://supabase.com](https://supabase.com).
2. Go to **Project Settings → API** and obtain your **Project URL** and **anon public Key**.

### 2. Run Database Migrations
In your Supabase **SQL Editor**, execute the migration scripts in the following order:
1. `supabase_schema.sql` — Base tables, RLS policies, and seed data.
2. `supabase_cv_analytics_migration.sql` — Secure CV download tracking table and admin analytics policies.
3. `supabase_visitor_analytics_migration.sql` — Anonymous visitor and page view tracking table with RLS.

### 3. Configure Supabase Storage (For Project Images)
1. In Supabase Dashboard, navigate to **Storage**.
2. Create a public bucket named `portfolio_assets`.
3. Add a public storage policy allowing authenticated uploads and public reads.

---

## 💻 Environment Variables

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.example .env.local
```

Inside `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```
abderrahman-portfolio/
├── index.html                                  # Root HTML with font optimization & favicons
├── package.json                                # Dependencies and scripts
├── tailwind.config.js                          # Theme colors, fonts, and RTL setup
├── vite.config.ts                              # Chunked Rollup production configuration
├── supabase_schema.sql                         # Base PostgreSQL schema and seed data
├── supabase_cv_analytics_migration.sql         # CV download analytics schema
├── supabase_visitor_analytics_migration.sql     # Visitor page view analytics schema
├── .env.example                                # Environment variable template
├── public/
│   ├── Abderrahman_El_Harakani_CV.pdf          # Professional PDF CV
│   ├── profile.jpg                             # High-resolution portrait identity asset
│   ├── favicon.ico                             # Favicon assets
│   └── images/                                 # Additional identity images
└── src/
    ├── types/                                  # TypeScript interfaces & data models
    ├── lib/                                    # Supabase client & credentials helper
    ├── translations/                           # Trilingual dictionaries (EN, FR, AR)
    ├── contexts/                               # Auth, Data, Language, Theme contexts
    ├── admin/                                  # Private Admin CMS Dashboard pages
    └── components/                             # Public portfolio UI components
```

---

## 📄 License

This project is personal intellectual property designed for **Abderrahman El Harakani**.
