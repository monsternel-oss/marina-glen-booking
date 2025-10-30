# Marina Glen Holiday Resort - Booking System

A comprehensive holiday resort booking management system for Marina Glen Holiday Resort, built with modern web technologies.

## 🏨 Features

- **Room Management**: Manage room types, availability, and pricing
- **Booking System**: Complete reservation workflow with confirmation
- **Guest Management**: Customer profiles, history, and preferences
- **Calendar Integration**: Real-time availability display
- **Payment Processing**: Secure payment handling with Stripe
- **Admin Dashboard**: Analytics, reporting, and system management
- **Responsive Design**: Mobile-friendly interface
- **Authentication**: JWT-based secure user authentication

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **PostgreSQL** - Robust relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marina-glen-booking-system
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Database Setup**
   - Create a PostgreSQL database named `marina_glen_booking`
   - Copy `.env.example` to `.env` in the backend directory
   - Update database credentials in `.env`

4. **Environment Configuration**
   ```bash
   # Backend (.env file)
   DATABASE_URL=postgresql://username:password@localhost:5432/marina_glen_booking
   JWT_SECRET=your-super-secret-jwt-key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   ```

## 🚀 Development

### Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Runs on http://localhost:3000
npm run dev:backend   # Runs on http://localhost:5000
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 📁 Project Structure

```
marina-glen-booking-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── dist/               # Build output
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── dist/               # Build output
└── docs/                   # Project documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend development server
- `npm run dev:backend` - Start only backend development server
- `npm run build` - Build both frontend and backend for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint on both frontend and backend
- `npm run test` - Run test suites

## 🗃️ Database Schema

The system uses PostgreSQL with the following main entities:
- Users (guests and administrators)
- Rooms and room types
- Bookings and reservations
- Payments and transactions
- Guest profiles and preferences

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- SQL injection prevention

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Rooms
- `GET /api/rooms` - Get available rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms` - Create room (admin only)
- `PUT /api/rooms/:id` - Update room (admin only)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

## 🎨 UI Components

The frontend includes custom components for:
- Booking calendar and date picker
- Room gallery and details
- Guest dashboard and profile
- Admin management interface
- Payment forms and processing
- Responsive navigation and layout

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build:frontend
# Deploy the frontend/dist folder
```

### Backend (Heroku/Railway)
```bash
npm run build:backend
# Deploy with environment variables configured
```

### Database (PostgreSQL)
- Use managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
- Run migrations after deployment
- Configure connection string in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation for endpoint details

## 🔮 Future Enhancements

- Mobile app development
- Multi-language support
- Advanced reporting and analytics
- Integration with external booking platforms
- AI-powered pricing optimization
- Real-time chat support
- Email marketing integration