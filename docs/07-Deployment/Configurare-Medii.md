# Configurare Medii - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 1. Environment Variables

### 1.1 Development (`.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # SECRET!

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Email (optional in dev)
RESEND_API_KEY=re_xxx # Or SendGrid

# Monitoring (optional)
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 1.2 Production (Vercel)

**Add în Vercel Dashboard** → Settings → Environment Variables:

| Variable | Value | Environment | Secret |
|----------|-------|-------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Production, Preview | No |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Production | **Yes** |
| `NEXT_PUBLIC_APP_URL` | `https://campusconnect.ro` | Production | No |
| | `https://$VERCEL_URL` | Preview | No |
| `RESEND_API_KEY` | `re_xxx` | Production | **Yes** |
| `SENTRY_DSN` | `https://xxx@sentry.io/xxx` | Production | **Yes** |

---

## 2. Supabase Configuration

### 2.1 Project Settings

**Dashboard** → Settings → API:
```bash
Project URL: https://xxx.supabase.co
Anon (public) key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service role (secret): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (DON'T EXPOSE!)
```

### 2.2 Database Connection

```bash
Host: db.xxx.supabase.co
Database: postgres
Port: 5432
User: postgres
Password: [your-db-password]

# Connection string
postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
```

### 2.3 Storage Buckets

| Bucket | Public | RLS | Purpose |
|--------|--------|-----|---------|
| `activity-images` | Yes | Yes | Activity photos |
| `profile-avatars` | Yes | Yes | User avatars |
| `certificates` | No | Yes | Generated certificates |

---

## 3. Next.js Configuration

### 3.1 `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  
  experimental: {
    serverActions: true,
  },
  
  // Sentry (if using)
  sentry: {
    hideSourceMaps: true,
  },
};

module.exports = nextConfig;
```

### 3.2 `.env.example`

```bash
# Copy this to .env.local and fill in values

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
NODE_ENV=development

# Email (optional)
RESEND_API_KEY=

# Monitoring (optional)
SENTRY_DSN=
```

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
