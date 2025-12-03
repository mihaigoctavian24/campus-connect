# Monitorizare - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 1. Vercel Analytics

### 1.1 Performance Metrics

**Core Web Vitals**:
- **LCP** (Largest Contentful Paint): Target < 2.5s
- **FID** (First Input Delay): Target < 100ms
- **CLS** (Cumulative Layout Shift): Target < 0.1

**Access**: Vercel Dashboard → Analytics → Web Vitals

### 1.2 Traffic Metrics

- Page views
- Unique visitors
- Top pages
- Geographic distribution
- Device breakdown (desktop/mobile)

---

## 2. Sentry Error Tracking

### 2.1 Setup

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**`sentry.client.config.ts`**:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

### 2.2 Custom Error Tracking

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'enrollment',
    },
    extra: {
      userId: user.id,
      activityId: activity.id,
    },
  });
}
```

---

## 3. Supabase Logs

### 3.1 Database Logs

**Access**: Supabase Dashboard → Logs Explorer

**Filters**:
- Slow queries (> 1s)
- Failed queries
- Connection errors

### 3.2 API Logs

**Track**:
- API requests
- Auth events
- Storage uploads
- Edge Function executions

---

## 4. Custom Monitoring

### 4.1 API Response Times

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const start = Date.now();
  
  const response = await NextResponse.next();
  
  const duration = Date.now() - start;
  
  if (duration > 1000) {
    console.warn(`Slow request: ${request.url} took ${duration}ms`);
  }
  
  return response;
}
```

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
