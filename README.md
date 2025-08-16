# AI Campus — Expenses App
A modern, full-stack expense management application built with Next.js, Prisma, and PostgreSQL. Features a beautiful, responsive UI with excellent user experience.

## ✨ Features

### 🎨 Modern UI/UX
- **Beautiful Design**: Modern dark theme with gradient accents and smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Professional Typography**: Clean, readable fonts with proper hierarchy
- **Visual Feedback**: Success/error messages, loading spinners, and status indicators

### 🔐 Authentication
- **Secure Login/Register**: Username and password authentication
- **Session Management**: JWT-based authentication with secure cookies
- **User Experience**: Smooth registration flow with success messages
- **Form Validation**: Client-side validation with helpful error messages

### 💰 Expense Management
- **CRUD Operations**: Create, read, update, and delete expenses
- **Smart Categories**: Travel ✈️, Food 🍽️, Office 🏢, Other 📦
- **Reimbursable Tracking**: Mark expenses as reimbursable or personal
- **Tax Calculation**: Automatic tax calculation with configurable rates
- **Grand Total**: Calculated server-side (amount + tax)

### 📊 Advanced Features
- **Pagination**: Efficient data loading with customizable page sizes
- **Search & Filter**: Find expenses by description, category, or status
- **Sorting**: Sort by date, amount, or other criteria
- **Real-time Updates**: Instant feedback on all operations
- **Data Validation**: Server-side validation for data integrity

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or use [Neon](https://neon.tech) for free)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-campus-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   DATABASE_URL=postgresql://user:password@host/database
   JWT_SECRET=your-secret-key-here
   AUTH_COOKIE=token
   ```

4. **Set up the database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### First Time Setup
1. Click "Get Started" to create an account
2. Fill in your username and password (minimum 6 characters)
3. You'll be redirected to login with a success message
4. Sign in with your credentials

### Managing Expenses
1. **Add an Expense**: Use the form on the left sidebar
   - Enter description, select category, set amount and tax rate
   - Toggle reimbursable status if needed
   - Click "Add Expense"

2. **View & Filter**: Use the search and filter options
   - Search by description
   - Filter by category or reimbursable status
   - Sort by date or amount

3. **Delete Expenses**: Click the delete button on any expense row
   - Confirmation dialog prevents accidental deletions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HttpOnly cookies
- **Deployment**: Vercel-ready

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3b82f6 to #2563eb)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)
- **Background**: Dark slate (#0f172a)
- **Cards**: Slate (#1e293b)

### Components
- **Cards**: Rounded corners with subtle shadows and hover effects
- **Buttons**: Gradient backgrounds with hover animations
- **Forms**: Clean inputs with focus states and icons
- **Tables**: Responsive design with hover effects
- **Badges**: Status indicators with color coding

### Animations
- **Fade In**: Smooth entrance animations
- **Hover Effects**: Subtle transformations and color changes
- **Loading States**: Spinning indicators and skeleton screens
- **Transitions**: Smooth state changes throughout the app

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured layout with sidebar and detailed tables
- **Tablet**: Adaptive layout with collapsible sections
- **Mobile**: Touch-friendly interface with simplified navigation

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/session` - Get current user

### Expenses
- `GET /api/expenses` - List expenses with pagination/filtering
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get single expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Environment Variables for Production
```env
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-secret
AUTH_COOKIE=token
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Campus assignment and is for educational purposes.

---

**Built with ❤️ using Next.js, Prisma, and Tailwind CSS**
# shipsy-campus-assighnment
