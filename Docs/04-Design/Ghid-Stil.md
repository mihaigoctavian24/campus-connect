# Ghid de Stil - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 1. Principii de Design

### 1.1 Claritate

**Prioritizează informația importantă**:
- Titluri clare și descriptive
- Hierarhie vizuală evidentă
- White space generos între secțiuni

### 1.2 Consistență

**Păstrează uniformitatea**:
- Același layout pentru pagini similare
- Butoane cu poziții predictibile
- Iconuri din același set (Lucide React)

### 1.3 Feedback

**Confirmă acțiunile utilizatorului**:
- Loading states pentru operații async
- Success/error messages după submit
- Hover states pentru elemente interactive

### 1.4 Simplitate

**Reduce complexitatea**:
- Max 3 click-uri până la orice funcționalitate
- Forms cu pași clari (wizard)
- Progressive disclosure (arată doar ce e necesar)

---

## 2. Voice & Tone

### 2.1 Mesaje în Română

**Informal dar profesional**:

✅ **Good**:
- "Înscrierea ta a fost confirmată!"
- "Ai câștigat 5 ore de voluntariat"
- "Ne pare rău, această activitate este completă"

❌ **Avoid**:
- "Your enrollment has been confirmed" (Engleză)
- "Dvs. ați fost înscris" (Prea formal)
- "Ooops! Something went wrong" (Prea casual)

### 2.2 Mesaje de Eroare

**Constructive, nu acuzatoare**:

✅ **Good**:
- "Te rugăm să introduci un email valid"
- "Parola trebuie să aibă minim 8 caractere"
- "Această activitate necesită minim an 2 de studiu"

❌ **Avoid**:
- "Email invalid!" (Fără explicație)
- "Error 422" (Cod tehnic)
- "Nu poți face asta" (Vag)

### 2.3 Confirmări

**Cere confirmare pentru acțiuni distructive**:

```tsx
<AlertDialog>
  <AlertDialogTrigger>Șterge activitate</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
    <AlertDialogDescription>
      Această acțiune va anula înscrierea celor 15 studenți. 
      Ei vor primi o notificare.
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Anulează</AlertDialogCancel>
      <AlertDialogAction>Da, șterge</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 3. Layout Guidelines

### 3.1 Grid System

**12-Column Grid** (Tailwind):

```tsx
<div className="grid grid-cols-12 gap-6">
  {/* Sidebar - 3 columns */}
  <aside className="col-span-12 md:col-span-3">
    <Sidebar />
  </aside>
  
  {/* Main content - 9 columns */}
  <main className="col-span-12 md:col-span-9">
    {children}
  </main>
</div>
```

### 3.2 Container Widths

```tsx
<div className="container mx-auto px-4">
  {/* Max width: 1280px (xl breakpoint) */}
  {/* Centered with auto margins */}
  {/* 16px padding on mobile */}
</div>
```

### 3.3 Vertical Rhythm

**Spacing între secțiuni**: Multipli de 8px

```tsx
<div className="space-y-8">  {/* 32px între children */}
  <Section1 />
  <Section2 />
  <Section3 />
</div>
```

---

## 4. Component Patterns

### 4.1 Activity Card

**Standard Pattern**:

```tsx
<Card className="overflow-hidden hover:shadow-lg transition-shadow">
  {/* Image */}
  <div className="relative h-48 bg-gray-200">
    <Image src={image} alt={title} fill className="object-cover" />
    <Badge className="absolute top-2 right-2">
      {category}
    </Badge>
  </div>
  
  {/* Content */}
  <CardHeader>
    <CardTitle className="line-clamp-2">{title}</CardTitle>
    <CardDescription className="line-clamp-3">
      {description}
    </CardDescription>
  </CardHeader>
  
  {/* Meta */}
  <CardContent className="space-y-2">
    <div className="flex items-center text-sm text-gray-600">
      <Calendar className="h-4 w-4 mr-2" />
      {date}
    </div>
    <div className="flex items-center text-sm text-gray-600">
      <MapPin className="h-4 w-4 mr-2" />
      {location}
    </div>
    <div className="flex items-center text-sm text-gray-600">
      <Clock className="h-4 w-4 mr-2" />
      {hours} ore
    </div>
  </CardContent>
  
  {/* Action */}
  <CardFooter>
    <Button className="w-full">Vezi detalii</Button>
  </CardFooter>
</Card>
```

### 4.2 Stats Card

```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium text-gray-600">
      Total Ore
    </CardTitle>
    <Clock className="h-4 w-4 text-gray-400" />
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-navy">
      24.5
    </div>
    <p className="text-xs text-gray-500 mt-1">
      +12% față de luna trecută
    </p>
  </CardContent>
</Card>
```

### 4.3 Empty State

```tsx
<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
  <div className="rounded-full bg-gray-100 p-6 mb-4">
    <Icon className="h-12 w-12 text-gray-400" />
  </div>
  <h3 className="text-lg font-semibold mb-2">
    Nu ai activități încă
  </h3>
  <p className="text-gray-600 mb-6 max-w-sm">
    Explorează oportunități și înscrie-te la prima ta activitate de voluntariat.
  </p>
  <Button asChild>
    <Link href="/explore">
      <Search className="mr-2 h-4 w-4" />
      Explorează activități
    </Link>
  </Button>
</div>
```

### 4.4 Loading State

```tsx
// Skeleton loader
<Card>
  <CardHeader>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2 mt-2" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-40 w-full" />
  </CardContent>
</Card>

// Spinner
<div className="flex items-center justify-center py-12">
  <Loader2 className="h-8 w-8 animate-spin text-navy" />
</div>
```

---

## 5. Form Design

### 5.1 Input Fields

**Label + Input + Help Text**:

```tsx
<div className="space-y-2">
  <Label htmlFor="email">
    Email universitar
    <span className="text-red-500 ml-1">*</span>
  </Label>
  <Input
    id="email"
    type="email"
    placeholder="nume.prenume@univ.ro"
    aria-describedby="email-help"
  />
  <p id="email-help" className="text-sm text-gray-500">
    Folosește emailul universitar pentru verificare
  </p>
</div>
```

### 5.2 Error States

```tsx
<div className="space-y-2">
  <Label htmlFor="title" className="text-red-600">
    Titlu activitate
  </Label>
  <Input
    id="title"
    className="border-red-500 focus:ring-red-500"
    aria-invalid="true"
    aria-describedby="title-error"
  />
  <p id="title-error" className="text-sm text-red-600">
    Titlul trebuie să aibă minim 10 caractere
  </p>
</div>
```

### 5.3 Multi-Step Forms (Wizard)

```tsx
<div className="space-y-6">
  {/* Progress indicator */}
  <div className="flex items-center justify-between">
    {steps.map((step, i) => (
      <div key={i} className="flex items-center">
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center",
          i <= currentStep 
            ? "bg-navy text-white" 
            : "bg-gray-200 text-gray-600"
        )}>
          {i + 1}
        </div>
        {i < steps.length - 1 && (
          <div className={cn(
            "h-1 w-16",
            i < currentStep ? "bg-navy" : "bg-gray-200"
          )} />
        )}
      </div>
    ))}
  </div>
  
  {/* Step content */}
  <div>{renderStep(currentStep)}</div>
  
  {/* Navigation */}
  <div className="flex justify-between">
    <Button
      variant="outline"
      onClick={prevStep}
      disabled={currentStep === 0}
    >
      Înapoi
    </Button>
    <Button onClick={nextStep}>
      {currentStep === steps.length - 1 ? 'Finalizează' : 'Următorul'}
    </Button>
  </div>
</div>
```

---

## 6. Navigation Patterns

### 6.1 Top Navigation

```tsx
<header className="bg-navy text-white sticky top-0 z-50">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Logo className="h-8 w-8" />
        <span className="font-bold text-xl">Campus Connect</span>
      </Link>
      
      {/* Desktop Nav */}
      <nav className="hidden md:flex space-x-6">
        <NavLink href="/explore">Explorează</NavLink>
        <NavLink href="/dashboard">Dashboard</NavLink>
        <NavLink href="/profile">Profil</NavLink>
      </nav>
      
      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Avatar src={user.avatar} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Setări</DropdownMenuItem>
          <DropdownMenuItem>Ajutor</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</header>
```

### 6.2 Breadcrumbs

```tsx
<nav aria-label="breadcrumb" className="mb-6">
  <ol className="flex items-center space-x-2 text-sm">
    <li>
      <Link href="/" className="text-gray-500 hover:text-navy">
        Home
      </Link>
    </li>
    <ChevronRight className="h-4 w-4 text-gray-400" />
    <li>
      <Link href="/dashboard" className="text-gray-500 hover:text-navy">
        Dashboard
      </Link>
    </li>
    <ChevronRight className="h-4 w-4 text-gray-400" />
    <li className="text-navy font-medium">
      Activități
    </li>
  </ol>
</nav>
```

### 6.3 Tabs

```tsx
<Tabs defaultValue="details">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="details">Detalii</TabsTrigger>
    <TabsTrigger value="students">Studenți (15)</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="details">{/* Content */}</TabsContent>
  <TabsContent value="students">{/* Content */}</TabsContent>
  <TabsContent value="analytics">{/* Content */}</TabsContent>
</Tabs>
```

---

## 7. Status Indicators

### 7.1 Badges

```tsx
// Status badges
<Badge variant="default">OPEN</Badge>        // Navy
<Badge variant="secondary">IN_PROGRESS</Badge>  // Gray
<Badge variant="success">COMPLETED</Badge>    // Green
<Badge variant="destructive">CANCELLED</Badge>  // Red

// Category badges
<Badge className="bg-blue-100 text-blue-800">
  Academic Support
</Badge>
```

### 7.2 Progress Bars

```tsx
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">Progres către obiectiv</span>
    <span className="font-medium">24 / 50 ore</span>
  </div>
  <Progress value={48} className="h-2" />
</div>
```

### 7.3 Alert Messages

```tsx
<Alert variant="success">
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Înscrierea ta a fost confirmată.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Eroare</AlertTitle>
  <AlertDescription>
    Nu s-a putut procesa cererea. Te rugăm să încerci din nou.
  </AlertDescription>
</Alert>
```

---

## 8. Data Display

### 8.1 Tables

**Desktop**: Full table  
**Mobile**: Stack cards

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Student</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {students.map(student => (
      <TableRow key={student.id}>
        <TableCell className="font-medium">
          {student.name}
        </TableCell>
        <TableCell>{student.email}</TableCell>
        <TableCell>
          <Badge>{student.status}</Badge>
        </TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 8.2 Lists

```tsx
<div className="divide-y">
  {items.map(item => (
    <div key={item.id} className="py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar src={item.avatar} />
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-500">{item.subtitle}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm">
        View
      </Button>
    </div>
  ))}
</div>
```

---

## 9. Best Practices

### 9.1 Do's

✅ **Use semantic HTML**: `<button>` not `<div onClick>`  
✅ **Provide alt text**: All images must have descriptive alt  
✅ **Show loading states**: Never leave user wondering  
✅ **Validate early**: Client-side validation before submit  
✅ **Give feedback**: Toast after every action  
✅ **Be consistent**: Same patterns across app  

### 9.2 Don'ts

❌ **Don't use generic errors**: "Error occurred" → specify what  
❌ **Don't disable without reason**: Show why button is disabled  
❌ **Don't use only color**: Add icons/text for status  
❌ **Don't autoplay**: Videos/animations need user trigger  
❌ **Don't use jargon**: "RLS error" → "Acces interzis"  

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
