# Strategie Testing - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 1. Piramida de Testare

```
           /\
          /  \  E2E (10%)
         /____\
        /      \
       /  INT   \ Integration (30%)
      /__________\
     /            \
    /    UNIT      \ Unit Tests (60%)
   /________________\
```

---

## 2. Unit Tests

### 2.1 Framework: Vitest

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**`vitest.config.ts`**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
});
```

### 2.2 Example: Component Test

```typescript
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { expect, test } from 'vitest';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick when clicked', async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Click</Button>);
  
  await userEvent.click(screen.getByText('Click'));
  expect(onClick).toHaveBeenCalledOnce();
});
```

### 2.3 Example: Util Test

```typescript
// lib/__tests__/utils.test.ts
import { cn } from '@/lib/utils';
import { expect, test } from 'vitest';

test('merges classnames correctly', () => {
  expect(cn('foo', 'bar')).toBe('foo bar');
  expect(cn('foo', false && 'bar')).toBe('foo');
});
```

---

## 3. Integration Tests

### 3.1 API Route Tests

```typescript
// app/api/activities/__tests__/route.test.ts
import { POST } from '../route';
import { expect, test, vi } from 'vitest';

test('POST /api/activities creates activity', async () => {
  const request = new Request('http://localhost/api/activities', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Test Activity',
      category: 'ACADEMIC_SUPPORT',
      capacity: 20,
    }),
  });
  
  const response = await POST(request);
  const data = await response.json();
  
  expect(response.status).toBe(201);
  expect(data).toHaveProperty('id');
});
```

---

## 4. E2E Tests

### 4.1 Framework: Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

**`playwright.config.ts`**:
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
});
```

### 4.2 Example: Auth Flow

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up', async ({ page }) => {
  await page.goto('/sign-up');
  
  await page.fill('[name="firstName"]', 'Ana');
  await page.fill('[name="lastName"]', 'Popescu');
  await page.fill('[name="email"]', 'ana@univ.ro');
  await page.fill('[name="password"]', 'Password123');
  
  await page.click('[type="submit"]');
  
  await expect(page).toHaveURL('/auth/verify-email');
});
```

---

## 5. Coverage Target

| Type | Target | Current |
|------|--------|---------|
| Unit | 80% | TBD |
| Integration | 60% | TBD |
| E2E | Critical flows | TBD |

**Run coverage**:
```bash
npm run test:coverage
```

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
