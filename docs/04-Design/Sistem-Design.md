# Sistem Design - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 1. Design Tokens

### 1.1 Culori Brand

**Paleta Principală**:

```css
:root {
  /* Brand Colors */
  --navy: #001f3f;           /* Navy Blue - Primary actions */
  --burgundy: #800020;       /* Burgundy - Accents */
  --gold: #FFD700;           /* Gold - Highlights, CTAs */
  
  /* Neutrals */
  --white: #FFFFFF;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* Semantic Colors */
  --success: #10B981;        /* Green */
  --warning: #F59E0B;        /* Orange */
  --error: #EF4444;          /* Red */
  --info: #3B82F6;           /* Blue */
}
```

**Usage Guidelines**:

| Color | Use Cases | Don't Use For |
|-------|-----------|---------------|
| **Navy** | Headers, primary buttons, navigation | Large text blocks, backgrounds |
| **Gold** | Hover states, active elements, badges | Body text, disabled states |
| **Burgundy** | Special highlights, alerts | Primary actions |
| **Success Green** | Confirmations, approvals | Warnings, errors |
| **Error Red** | Errors, rejections, destructive actions | Success messages |

### 1.2 Tipografie

**Font Stack**:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;
```

**Type Scale**:

| Size | CSS Class | Use Case | Weight |
|------|-----------|----------|--------|
| 48px | `.text-5xl` | Hero headings | Bold (700) |
| 36px | `.text-4xl` | Page titles | Bold (700) |
| 30px | `.text-3xl` | Section headers | Semibold (600) |
| 24px | `.text-2xl` | Card titles | Semibold (600) |
| 20px | `.text-xl` | Subheadings | Medium (500) |
| 16px | `.text-base` | Body text, buttons | Regular (400) |
| 14px | `.text-sm` | Labels, secondary text | Regular (400) |
| 12px | `.text-xs` | Captions, metadata | Regular (400) |

**Line Heights**:
- Headlines: 1.2
- Body: 1.5
- Buttons: 1.0

### 1.3 Spacing System

**8-Point Grid**:

```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
--spacing-20: 5rem;    /* 80px */
```

**Component Padding**:
- Buttons: `px-4 py-2` (16px × 8px)
- Cards: `p-6` (24px all sides)
- Modals: `p-8` (32px all sides)
- Page containers: `px-4 md:px-8 lg:px-12`

### 1.4 Border Radius

```css
--radius-sm: 0.375rem;   /* 6px - Small elements */
--radius-md: 0.5rem;     /* 8px - Buttons, inputs */
--radius-lg: 0.625rem;   /* 10px - Cards (default) */
--radius-xl: 1rem;       /* 16px - Modals */
--radius-2xl: 1.5rem;    /* 24px - Images */
--radius-full: 9999px;   /* Full circle - Avatars, badges */
```

### 1.5 Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

**Usage**:
- Cards: `shadow-md`
- Modals: `shadow-xl`
- Dropdowns: `shadow-lg`
- Hover states: Increase by one level

---

## 2. Component Library (shadcn/ui)

### 2.1 Button Variants

```tsx
// Primary (Default)
<Button>Enroll Now</Button>

// Secondary
<Button variant="secondary">Cancel</Button>

// Destructive
<Button variant="destructive">Delete Activity</Button>

// Outline
<Button variant="outline">View Details</Button>

// Ghost
<Button variant="ghost">Edit</Button>

// Link
<Button variant="link">Learn More</Button>
```

**Sizes**:
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### 2.2 Form Elements

**Input**:
```tsx
<Input 
  type="text" 
  placeholder="Enter activity title"
  className="w-full"
/>
```

**Textarea**:
```tsx
<Textarea 
  placeholder="Describe the activity..."
  rows={5}
/>
```

**Select**:
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="academic">Academic Support</SelectItem>
    <SelectItem value="community">Community Service</SelectItem>
  </SelectContent>
</Select>
```

**Checkbox**:
```tsx
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms">I agree to terms</label>
</div>
```

### 2.3 Cards

**Basic Card**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>STEM Mentorship</CardTitle>
    <CardDescription>Help first-year students</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Description content...</p>
  </CardContent>
  <CardFooter>
    <Button>Enroll</Button>
  </CardFooter>
</Card>
```

**Stats Card**:
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
    <Clock className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">24.5</div>
    <p className="text-xs text-muted-foreground">+12% from last month</p>
  </CardContent>
</Card>
```

### 2.4 Modals (Dialogs)

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>View Details</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Activity Details</DialogTitle>
      <DialogDescription>
        Full information about this opportunity
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Content */}
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 2.5 Notifications (Toast)

```tsx
import { toast } from 'sonner';

// Success
toast.success('Enrollment confirmed!');

// Error
toast.error('Failed to enroll. Please try again.');

// Info
toast.info('Session starts in 1 hour');

// Warning
toast.warning('Activity capacity almost full');

// With action
toast('QR Code generated', {
  action: {
    label: 'View',
    onClick: () => console.log('View clicked')
  }
});
```

---

## 3. Layout Patterns

### 3.1 Dashboard Layout

```tsx
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="bg-navy text-white">
    <div className="container mx-auto px-4 py-4">
      <Navigation />
    </div>
  </header>
  
  {/* Main Content */}
  <main className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <Sidebar />
      </aside>
      
      {/* Content */}
      <div className="lg:col-span-3">
        {children}
      </div>
    </div>
  </main>
</div>
```

### 3.2 Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {activities.map(activity => (
    <ActivityCard key={activity.id} activity={activity} />
  ))}
</div>
```

### 3.3 Form Layout

```tsx
<form className="space-y-6">
  {/* Section 1 */}
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Basic Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField name="title" />
      <FormField name="category" />
    </div>
  </div>
  
  {/* Section 2 */}
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Logistics</h3>
    <FormField name="location" />
  </div>
  
  {/* Actions */}
  <div className="flex justify-end space-x-4">
    <Button variant="outline">Cancel</Button>
    <Button type="submit">Create Activity</Button>
  </div>
</form>
```

---

## 4. Responsive Design

### 4.1 Breakpoints (Tailwind)

```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large desktops */
2xl: 1536px /* Extra large */
```

### 4.2 Mobile Navigation

**Hamburger Menu**:
```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu />
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <nav className="flex flex-col space-y-4">
      <Link href="/explore">Explore</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/profile">Profile</Link>
    </nav>
  </SheetContent>
</Sheet>
```

### 4.3 Responsive Tables

**Desktop**: Full table  
**Mobile**: Card view

```tsx
<div className="hidden md:block">
  <Table>{/* Full table */}</Table>
</div>
<div className="md:hidden space-y-4">
  {data.map(item => (
    <Card key={item.id}>{/* Card view */}</Card>
  ))}
</div>
```

---

## 5. Iconography

### 5.1 Lucide React Icons

**Common Icons**:

| Icon | Component | Use Case |
|------|-----------|----------|
| 📚 | `<BookOpen />` | Academic activities |
| 🤝 | `<Users />` | Community service |
| 🎉 | `<Sparkles />` | Events |
| ✅ | `<CheckCircle />` | Confirmations |
| ❌ | `<XCircle />` | Errors |
| ⏰ | `<Clock />` | Time/Hours |
| 📍 | `<MapPin />` | Location |
| 📧 | `<Mail />` | Email |
| 🔔 | `<Bell />` | Notifications |
| ⚙️ | `<Settings />` | Settings |

**Size Guide**:
```tsx
<Icon className="h-4 w-4" />  {/* Small - 16px */}
<Icon className="h-5 w-5" />  {/* Medium - 20px */}
<Icon className="h-6 w-6" />  {/* Large - 24px */}
<Icon className="h-8 w-8" />  {/* XL - 32px */}
```

---

## 6. Animation & Transitions

### 6.1 Motion Principles

**Durations**:
```css
transition-duration: 150ms;  /* Fast - Buttons, hover */
transition-duration: 300ms;  /* Normal - Modals, drawers */
transition-duration: 500ms;  /* Slow - Page transitions */
```

**Easing**:
```css
ease-in-out   /* Default */
ease-out      /* Entrances */
ease-in       /* Exits */
```

### 6.2 Common Animations

**Fade In**:
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

**Slide In**:
```tsx
<motion.div
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

---

## 7. Accessibility (a11y)

### 7.1 Color Contrast

**WCAG AA Compliance**:
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

✅ **Navy (#001f3f) on White**: 16.3:1 (Pass AAA)  
✅ **Gold (#FFD700) on Navy**: 7.8:1 (Pass AA)  
⚠️ **Gray-400 on White**: 2.8:1 (Fail - use for decorative only)

### 7.2 Keyboard Navigation

**Focus Styles**:
```css
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}
```

**Tab Order**: Logical flow (top → bottom, left → right)

### 7.3 Screen Reader Support

**ARIA Labels**:
```tsx
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

<img src="activity.jpg" alt="Students participating in STEM workshop" />

<input 
  type="text" 
  id="email"
  aria-describedby="email-hint"
/>
<span id="email-hint">We'll never share your email</span>
```

---

## 8. Dark Mode (Planned)

**CSS Variables Strategy**:

```css
/* Light Mode (Default) */
:root {
  --background: 0 0% 100%;
  --foreground: 210 100% 12.5%;
}

/* Dark Mode */
.dark {
  --background: 210 100% 12.5%;
  --foreground: 0 0% 98%;
}
```

**Usage**:
```tsx
<div className="bg-background text-foreground">
  Content adapts to theme
</div>
```

---

## 9. Performance Optimizations

### 9.1 Image Optimization

**Next.js Image Component**:
```tsx
<Image
  src="/activity.jpg"
  alt="Activity"
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

**Benefits**:
- Auto WebP/AVIF conversion
- Lazy loading
- Responsive srcset
- Quality optimization

### 9.2 Font Loading

**Strategy**: `font-display: swap`

```tsx
// next.config.js
module.exports = {
  optimizeFonts: true,
};
```

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
