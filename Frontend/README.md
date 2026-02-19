# Smart Public Grievance Redressal System

A production-ready frontend for a government-grade public grievance management system with role-based access control and AI-driven prioritization.

## Features

### Role-Based Portals
- **Citizen Portal**: Submit and track grievances
- **Department Portal**: Manage department-specific grievances
- **Admin Portal**: System oversight and analytics

### Key Capabilities
- JWT-based authentication with role validation
- Department-isolated dashboards
- AI-driven priority assignment (displayed from backend)
- Mass complaint detection
- Real-time status updates
- Professional, government-grade UI

## Architecture

### Frontend Stack
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- Axios for API integration
- Tailwind CSS for styling
- Lucide React for icons

### Project Structure
```
src/
├── api/              # API service layer
│   ├── client.ts     # Axios client with interceptors
│   ├── auth.ts       # Authentication endpoints
│   └── grievances.ts # Grievance endpoints
├── components/       # Reusable UI components
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Textarea.tsx
│   └── ProtectedRoute.tsx
├── contexts/         # React contexts
│   └── AuthContext.tsx
├── pages/           # Page components
│   ├── LoginCitizen.tsx
│   ├── LoginDepartment.tsx
│   ├── LoginAdmin.tsx
│   ├── CitizenDashboard.tsx
│   ├── DepartmentDashboard.tsx
│   └── AdminDashboard.tsx
├── utils/           # Utility functions
│   └── jwt.ts
└── App.tsx          # Main app with routing
```

## Setup

### Prerequisites
- Node.js 18+ and npm
- Backend API running (Node.js + MongoDB + Flask)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Authentication Flow

### Login Portals
- `/login/citizen` - Citizen login
- `/login/department` - Department official login
- `/login/admin` - Administrator login

### Role Validation
1. User enters credentials in role-specific portal
2. Frontend sends to `POST /api/auth/login`
3. Backend returns JWT with role and department
4. Frontend validates JWT role matches portal
5. If mismatch: error shown, login denied
6. If valid: token stored, redirect to dashboard

### Protected Routes
- `/citizen/dashboard` - Citizen only
- `/department/dashboard` - Department officials only
- `/admin/dashboard` - Administrators only

## API Integration

### Backend Endpoints Used

**Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

**Grievances**
- `POST /api/grievances` - Create grievance (Citizen)
- `GET /api/grievances/my` - Get user's grievances (Citizen)
- `GET /api/grievances/department/:dept` - Get department grievances (Department)
- `GET /api/grievances` - Get all grievances (Admin)
- `PUT /api/grievances/:id/status` - Update status (Department)

### JWT Payload Structure
```typescript
{
  userId: string;
  role: 'Citizen' | 'DepartmentOfficial' | 'Admin';
  department?: string;
  exp: number;
}
```

## UI/UX Guidelines

### Color Theme (Government-Grade)
- Primary: #1F3A5F (Civic Blue)
- Secondary: #2F5D8A
- Accent: #4A7BA7
- Background: #F5F7FA
- Text: #2E2E2E

### Status Colors
- Pending: Amber (#F59E0B)
- In Progress: Blue (#3B82F6)
- Resolved: Green (#2E7D32)

### Priority Colors
- Low: Gray (#9CA3AF)
- Medium: Amber (#F59E0B)
- High: Orange (#EA580C)
- Critical: Red (#B91C1C)

## User Roles

### Citizen
- Submit new grievances
- View own grievances only
- Track status and priority
- See assigned department

### Department Official
- View department-specific grievances only
- Update grievance status (Pending → In Progress → Resolved)
- See AI-assigned priority
- Manage task queue

### Administrator
- View all grievances (read-only)
- Filter by department
- View analytics and statistics
- Monitor system-wide metrics

## Security

- JWT stored in localStorage
- Automatic token validation on route change
- 401 responses trigger logout
- Role-based access control on all routes
- Department isolation enforced by backend

## Development

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## Production Deployment

1. Set environment variables:
   - `VITE_API_BASE_URL`: Backend API URL

2. Build the project:
```bash
npm run build
```

3. Deploy the `dist/` folder to your hosting service

4. Ensure backend API is accessible from frontend domain

## Features Detail

### Citizen Dashboard
- Grievance submission form with category selection
- Real-time grievance list with status
- Priority badges (AI-assigned)
- Timeline view of grievance progress
- Mass complaint indicators

### Department Dashboard
- Professional task management table
- Department-filtered grievances automatically
- Status update dropdown
- Priority sorting
- Statistics cards (Total, Pending, In Progress, Resolved)
- Mass complaint alerts

### Admin Dashboard
- System-wide statistics
- Department-wise distribution charts
- Priority distribution analytics
- Filter by department
- Comprehensive grievance table
- Read-only access (no modification)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Government Use Only
