# Apple Zen Mode - Secure Authentication

A beautiful, Apple-inspired authentication system built with React, TypeScript, and modern web technologies.

## 🌟 Features

- **Sleek Apple-inspired Design**: Clean, minimalist interface with smooth animations
- **Secure Authentication**: JWT-based authentication with environment variable credentials
- **Dark/Light Theme Toggle**: Seamless theme switching with localStorage persistence
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Error Handling**: Elegant error messages with subtle shake animations
- **Session Management**: Persistent login state with automatic token verification

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd apple-zen-mode
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   The `.env` file is already configured with demo credentials:
   ```
   ADMIN_EMAIL=pvamsikrisreddy@gmail.com
   ADMIN_PASSWORD=Krishna@123
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend servers
   npm run dev:full
   
   # Or start them separately:
   npm run dev        # Frontend (Vite) - http://localhost:8080
   npm run server     # Backend (Express) - http://localhost:3001
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:8080](http://localhost:8080)

## 🔐 Authentication

### Demo Credentials

- **Email**: `pvamsikrisreddy@gmail.com`
- **Password**: `Krishna@123`

### How it works

1. **Login Flow**: 
   - User enters credentials on the login page
   - Backend verifies against environment variables
   - JWT token is generated and stored in localStorage
   - User is redirected to protected dashboard

2. **Session Management**:
   - Token is automatically verified on app load
   - Invalid/expired tokens are cleared automatically
   - Users stay logged in until logout or token expiration

3. **Security Features**:
   - Credentials stored securely in environment variables
   - JWT tokens with 24-hour expiration
   - Protected routes with automatic redirection
   - CORS protection for API endpoints

## 🎨 Design System

### Apple-inspired Elements

- **Typography**: Light, clean fonts with proper spacing
- **Colors**: Subtle grays and whites with dark mode support
- **Shadows**: Soft, layered shadows for depth
- **Animations**: Smooth transitions and hover effects
- **Icons**: Lucide React icons for consistency

### Components

- **Login Form**: Clean input fields with icons and validation
- **Error Messages**: Red text with subtle shake animation
- **Loading States**: Spinning indicators and disabled states
- **Navigation**: Fixed header with theme toggle
- **Dashboard**: Card-based layout with user information

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Express.js** server
- **JWT** for authentication
- **CORS** for cross-origin requests
- **dotenv** for environment variables

### Development
- **ESLint** for code linting
- **TypeScript** for type safety
- **Concurrently** for running multiple servers

## 📁 Project Structure

```
apple-zen-mode/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (AuthContext)
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── server.js               # Express backend server
├── .env                    # Environment variables
└── package.json           # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run dev:full` - Start both servers concurrently
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout (client-side token removal)
- `GET /api/protected` - Example protected route

## 🎯 Usage

1. **Home Page**: Welcome screen with "Sign In" button
2. **Login Page**: Enter credentials to authenticate
3. **Dashboard**: Protected area showing user information
4. **Navigation**: Use the header to navigate and toggle themes
5. **Logout**: Click "Sign Out" in the dashboard

## 🔒 Security Notes

- Change the JWT secret in production
- Use environment variables for all sensitive data
- Consider implementing rate limiting
- Add HTTPS in production
- Hash passwords in a real application

## 🚀 Deployment

The application can be deployed to any platform that supports Node.js:

- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Heroku, Railway, or any Node.js hosting
- **Database**: Add a database for production use

---

Built with ❤️ using modern web technologies
