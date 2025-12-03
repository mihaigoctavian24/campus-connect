# Componente UI - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 1. shadcn/ui - Overview

**Ce este shadcn/ui?**

shadcn/ui nu este o bibliotecă NPM tradițională. Este o colecție de **componente refolosibile** construite cu:
- **Radix UI** (primitives headless)
- **Tailwind CSS** (styling)
- **TypeScript** (type safety)

**Avantaje**:
✅ Componente sunt **copiate** în proiect (nu dependency)  
✅ Control complet asupra codului  
✅ Customizare ușoară  
✅ Accessibility built-in (WCAG AA)  
✅ Theme support via CSS variables  

---

## 2. Instalare și Setup

### 2.1 Dependencies

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

### 2.2 Utilități

**`lib/utils.ts`**:
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage**:
```tsx
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className // User prop
)} />
```

---

## 3. Componente Core

### 3.1 Button

**Locație**: `components/ui/button.tsx`

**Variants**:

| Variant | Appearance | Use Case |
|---------|------------|----------|
| `default` | Navy solid | Primary actions (Enroll, Submit) |
| `secondary` | Gray outline | Secondary actions (Cancel) |
| `destructive` | Red solid | Delete, Remove |
| `outline` | Transparent with border | View Details |
| `ghost` | No background | Icon buttons, menu items |
| `link` | Underline text | Navigation links |

**Code**:
```tsx
import { Button } from '@/components/ui/button';

<Button>Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small Button</Button>
<Button size="lg">Large Button</Button>
<Button disabled>Disabled State</Button>
```

**Custom Styling**:
```tsx
<Button className="bg-gold hover:bg-gold/90">
  Custom Color
</Button>
```

### 3.2 Input

**Code**:
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email"
    type="email" 
    placeholder="nume.prenume@univ.ro"
    required
  />
</div>
```

**Types**:
```tsx
<Input type="text" />
<Input type="email" />
<Input type="password" />
<Input type="number" />
<Input type="tel" />
<Input type="url" />
<Input type="search" />
```

### 3.3 Textarea

```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea 
  placeholder="Descrie activitatea..."
  rows={5}
  maxLength={1000}
/>
```

### 3.4 Select

**Simple Select**:
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Alege categoria" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="academic">Academic Support</SelectItem>
    <SelectItem value="community">Community Service</SelectItem>
    <SelectItem value="sports">Sports & Recreation</SelectItem>
    <SelectItem value="arts">Arts & Culture</SelectItem>
  </SelectContent>
</Select>
```

**Grouped Select**:
```tsx
<SelectContent>
  <SelectGroup>
    <SelectLabel>Academic</SelectLabel>
    <SelectItem value="tutoring">Tutoring</SelectItem>
    <SelectItem value="mentoring">Mentoring</SelectItem>
  </SelectGroup>
  <SelectGroup>
    <SelectLabel>Community</SelectLabel>
    <SelectItem value="cleanup">Cleanup Events</SelectItem>
    <SelectItem value="charity">Charity Work</SelectItem>
  </SelectGroup>
</SelectContent>
```

### 3.5 Checkbox

```tsx
import { Checkbox } from '@/components/ui/checkbox';

<div className="flex items-center space-x-2">
  <Checkbox 
    id="terms" 
    checked={accepted}
    onCheckedChange={setAccepted}
  />
  <label htmlFor="terms" className="text-sm">
    Accept termenii și condițiile
  </label>
</div>
```

**Multiple Checkboxes**:
```tsx
{categories.map(cat => (
  <div key={cat.id} className="flex items-center space-x-2">
    <Checkbox 
      id={cat.id}
      checked={selected.includes(cat.id)}
      onCheckedChange={(checked) => {
        if (checked) {
          setSelected([...selected, cat.id]);
        } else {
          setSelected(selected.filter(id => id !== cat.id));
        }
      }}
    />
    <label htmlFor={cat.id}>{cat.name}</label>
  </div>
))}
```

### 3.6 Radio Group

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

<RadioGroup value={status} onValueChange={setStatus}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="OPEN" id="open" />
    <Label htmlFor="open">Open</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="CLOSED" id="closed" />
    <Label htmlFor="closed">Closed</Label>
  </div>
</RadioGroup>
```

---

## 4. Layout Components

### 4.1 Card

**Anatomy**:
```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Clickable Card**:
```tsx
<Card className="cursor-pointer hover:shadow-lg transition-shadow">
  <Link href={`/activity/${id}`}>
    {/* Card content */}
  </Link>
</Card>
```

### 4.2 Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="details">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="details">Detalii</TabsTrigger>
    <TabsTrigger value="students">Studenți</TabsTrigger>
    <TabsTrigger value="stats">Statistici</TabsTrigger>
  </TabsList>
  
  <TabsContent value="details">
    <Card>
      <CardContent className="pt-6">
        {/* Details content */}
      </CardContent>
    </Card>
  </TabsContent>
  
  <TabsContent value="students">
    {/* Students list */}
  </TabsContent>
  
  <TabsContent value="stats">
    {/* Stats charts */}
  </TabsContent>
</Tabs>
```

### 4.3 Accordion

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Ce este CampusConnect?</AccordionTrigger>
    <AccordionContent>
      CampusConnect este o platformă pentru gestionarea activităților...
    </AccordionContent>
  </AccordionItem>
  
  <AccordionItem value="item-2">
    <AccordionTrigger>Cum mă înscriu?</AccordionTrigger>
    <AccordionContent>
      Creează un cont cu emailul universitar...
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## 5. Overlay Components

### 5.1 Dialog (Modal)

**Basic Dialog**:
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Deschide</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titlu Dialog</DialogTitle>
      <DialogDescription>
        Descriere dialog aici
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Content */}
    </div>
    <DialogFooter>
      <Button variant="outline">Anulează</Button>
      <Button>Confirmă</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Controlled Dialog**:
```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    {/* ... */}
    <Button onClick={() => setOpen(false)}>
      Close
    </Button>
  </DialogContent>
</Dialog>
```

### 5.2 Alert Dialog

**Confirmation Dialog**:
```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Șterge activitate</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Ești absolut sigur?</AlertDialogTitle>
      <AlertDialogDescription>
        Această acțiune nu poate fi anulată. Activitatea va fi ștearsă 
        permanent și toți studenții înscriși vor primi o notificare.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Anulează</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Da, șterge
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### 5.3 Sheet (Drawer)

**Side Panel**:
```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Deschide meniu</Button>
  </SheetTrigger>
  <SheetContent side="left">
    <SheetHeader>
      <SheetTitle>Navigation</SheetTitle>
      <SheetDescription>Meniu principal</SheetDescription>
    </SheetHeader>
    <nav className="flex flex-col space-y-4 mt-6">
      <Link href="/explore">Explorează</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  </SheetContent>
</Sheet>
```

**Sides**: `left`, `right`, `top`, `bottom`

### 5.4 Popover

```tsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="space-y-2">
      <h4 className="font-medium">Activity Details</h4>
      <p className="text-sm text-gray-600">
        Quick preview information
      </p>
    </div>
  </PopoverContent>
</Popover>
```

### 5.5 Tooltip

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon">
        <Info className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Informații suplimentare</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 6. Feedback Components

### 6.1 Toast (Sonner)

**Installation**:
```bash
npm install sonner
```

**Setup** (`app/layout.tsx`):
```tsx
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

**Usage**:
```tsx
import { toast } from 'sonner';

// Success
toast.success('Înscrierea a fost confirmată!');

// Error
toast.error('Eroare la procesare. Încearcă din nou.');

// Info
toast.info('Sesiunea începe în 1 oră');

// Warning
toast.warning('Capacitatea activității aproape completă');

// With action
toast('QR Code generat', {
  description: 'Descarcă codul pentru sesiunea de astăzi',
  action: {
    label: 'Descarcă',
    onClick: () => downloadQR()
  }
});

// Loading
const promise = enrollStudent();
toast.promise(promise, {
  loading: 'Se procesează înscrierea...',
  success: 'Student înscris cu succes!',
  error: 'Eroare la înscriere'
});
```

### 6.2 Alert

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

{/* Success */}
<Alert variant="success">
  <CheckCircle2 className="h-4 w-4" />
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Activitatea a fost creată cu succes.
  </AlertDescription>
</Alert>

{/* Error */}
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Eroare</AlertTitle>
  <AlertDescription>
    Nu s-a putut salva. Verifică conexiunea.
  </AlertDescription>
</Alert>

{/* Info */}
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Info</AlertTitle>
  <AlertDescription>
    Această activitate necesită aprobare de la administrator.
  </AlertDescription>
</Alert>
```

### 6.3 Progress

```tsx
import { Progress } from '@/components/ui/progress';

<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Progres</span>
    <span>75%</span>
  </div>
  <Progress value={75} />
</div>
```

### 6.4 Skeleton

**Loading States**:
```tsx
import { Skeleton } from '@/components/ui/skeleton';

<Card>
  <CardHeader>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2 mt-2" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-40 w-full" />
  </CardContent>
</Card>
```

---

## 7. Navigation Components

### 7.1 Dropdown Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleEdit}>
      <Edit className="mr-2 h-4 w-4" />
      Editează
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleDuplicate}>
      <Copy className="mr-2 h-4 w-4" />
      Duplică
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem 
      onClick={handleDelete}
      className="text-red-600"
    >
      <Trash className="mr-2 h-4 w-4" />
      Șterge
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 7.2 Context Menu

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

<ContextMenu>
  <ContextMenuTrigger>
    <Card>Right click me</Card>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>View</ContextMenuItem>
    <ContextMenuItem>Edit</ContextMenuItem>
    <ContextMenuItem>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

---

## 8. Data Display

### 8.1 Table

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

<Table>
  <TableCaption>Lista de studenți înscriși</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Nume</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Acțiuni</TableHead>
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
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 8.2 Badge

```tsx
import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

{/* Custom colors */}
<Badge className="bg-green-100 text-green-800">APPROVED</Badge>
<Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>
```

### 8.3 Avatar

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src={user.avatar} alt={user.name} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>
```

---

## 9. Form Integration (React Hook Form)

### 9.1 Setup

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  title: z.string().min(10, 'Minim 10 caractere'),
  category: z.string(),
  hours: z.number().min(1).max(10),
});

type FormData = z.infer<typeof schema>;
```

### 9.2 Form Component

```tsx
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function ActivityForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      category: '',
      hours: 2,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titlu activitate</FormLabel>
              <FormControl>
                <Input placeholder="Ex: STEM Mentorship" {...field} />
              </FormControl>
              <FormDescription>
                Minim 10 caractere, maxim 100
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categorie</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Alege categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="academic">Academic Support</SelectItem>
                  <SelectItem value="community">Community Service</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Creează activitate</Button>
      </form>
    </Form>
  );
}
```

---

## 10. Custom Components (Aplicație)

### 10.1 ActivityCard

```tsx
export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-navy to-burgundy">
        <Badge className="absolute top-2 right-2 bg-gold text-navy">
          {activity.category}
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle className="line-clamp-2">{activity.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {activity.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          {format(activity.date, 'dd MMM yyyy', { locale: ro })}
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {activity.location}
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          {activity.hours} ore
        </div>
        <div className="flex items-center text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          {activity.enrolled} / {activity.capacity}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/activity/${activity.id}`}>
            Vezi detalii
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### 10.2 StatsCard

```tsx
export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon 
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-navy">
          {value}
        </div>
        {change && (
          <p className={cn(
            "text-xs mt-1",
            change > 0 ? "text-green-600" : "text-red-600"
          )}>
            {change > 0 ? '+' : ''}{change}% față de luna trecută
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
