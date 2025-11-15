# Campus Connect - Hub Voluntariat Universitar

Platform pentru gestionarea activităților de voluntariat studenţesc în mediul universitar.

## 🎯 Despre Proiect

Campus Connect este o platformă web modernă care facilitează înscrierea și gestionarea activităților de voluntariat pentru studenți, profesori/responsabili și administratori universitari.

**Domain**: [campusconnect-scs.work](https://campusconnect-scs.work)

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Deployment**: Vercel (auto-deploy from GitHub)
- **DNS**: Cloudflare

## 📋 Features

### Pentru Studenți
- ✅ Consultare activități disponibile
- ✅ Înscriere/Anulare la activități
- ✅ Istoric participări și prezență
- ✅ Notificări email + in-app
- ✅ Profil editabil
- ✅ Certificate de participare

### Pentru Profesori/Responsabili
- ✅ Creare și gestionare activități
- ✅ Validare prezență (manuală + QR code)
- ✅ Rapoarte și statistici
- ✅ Mesaje către participanți
- ✅ Export date (CSV/Excel)

### Pentru Administratori
- ✅ Management utilizatori și roluri
- ✅ Statistici generale
- ✅ Setări platformă
- ✅ Audit logs
- ✅ Rapoarte avansate

## 🛠️ Setup Development

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (already configured)

### Installation

```bash
# Clone repository
git clone https://github.com/mihaigoctavian24/campus-connect.git
cd campus-connect

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials (already in .docs/credentials.md)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
campus-connect/
├── .docs/                    # Documentation
│   ├── PRD-hub-voluntariat.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   └── credentials.md (gitignored)
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Auth pages
│   │   ├── (student)/       # Student dashboard
│   │   ├── (professor)/     # Professor dashboard
│   │   ├── (admin)/         # Admin dashboard
│   │   └── api/             # API routes
│   │
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   ├── features/        # Feature components
│   │   └── shared/          # Shared components
│   │
│   ├── lib/                 # Core libraries
│   │   ├── supabase/        # Supabase clients
│   │   ├── services/        # Business logic
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utilities
│   │   └── validations/     # Zod schemas
│   │
│   ├── types/               # TypeScript types
│   └── styles/              # Global styles
│
├── supabase/                # Supabase config
│   ├── migrations/          # Database migrations
│   ├── functions/           # Edge Functions
│   └── seed.sql             # Seed data
│
└── public/                  # Static assets
```

## 🗄️ Database

Using Supabase PostgreSQL with Row Level Security (RLS) enabled.

### Generate Types

```bash
# Generate TypeScript types from Supabase schema
npm run generate-types
```

### Migrations

```bash
# Create new migration
supabase migration new <migration_name>

# Apply migrations
supabase db reset

# Push to remote
supabase db push
```

## 🧪 Development Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check

# Format code
npm run format
```

## 🚢 Deployment

### Vercel (Automatic)

Pushes to `main` branch automatically trigger deployment to Vercel.

```bash
# Push to main
git push origin main
```

### Environment Variables

Set these in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Domain Configuration

Domain `campusconnect-scs.work` is managed via Cloudflare. DNS records configured to point to Vercel.

## 📚 Documentation

- [PRD](/.docs/PRD-hub-voluntariat.md) - Product Requirements Document
- [Technical Architecture](/.docs/TECHNICAL_ARCHITECTURE.md) - System design and architecture
- [Database Schema](/.docs/DATABASE_SCHEMA.md) - Complete database documentation
- [Design System](/.docs/DESIGN_SYSTEM.md) - UI design tokens and component specifications
- [Setup Guide](/.docs/SETUP_COMPLETE.md) - Complete setup verification and troubleshooting
- [Next Steps](/.docs/NEXT_STEPS.md) - Development roadmap and immediate tasks

## 🔐 Security

- Environment variables stored securely (never committed)
- Row Level Security (RLS) enabled on all tables
- JWT-based authentication via Supabase
- HTTPS enforced
- Input validation with Zod schemas
- XSS protection via React

## 📝 License

MIT

## 👥 Contributors

Built with ❤️ by Bubu & Dudu Dev Team

---

**Status**: 🚧 In Development
**Version**: 0.1.0
**Last Updated**: 2025-11-14