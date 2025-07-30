# WellnessHub - Wellness Session Platform

A full-stack web application for creating, managing, and sharing wellness sessions (yoga, meditation, mindfulness, etc.). Built with Node.js/Express backend and React/TypeScript frontend.

## 🌟 Features

### Authentication & User Management
- **User Registration & Login**: Secure authentication with JWT tokens
- **Password Security**: Bcrypt hashing with strong password requirements
- **Protected Routes**: Role-based access control for authenticated users
- **Persistent Sessions**: Auto-login with localStorage token management

### Session Management
- **Create Sessions**: Rich editor for wellness session creation
- **Draft System**: Auto-save functionality with draft management
- **Publishing**: Convert drafts to published sessions visible to all users
- **Session Editor**: Full CRUD operations with real-time saving
- **Tagging System**: Categorize sessions with custom tags

### Discovery & Browsing
- **Public Dashboard**: Browse all published wellness sessions
- **Advanced Search**: Search by title, tags, and content
- **Filtering**: Filter sessions by tags and status
- **Session Details**: Detailed view with author information and metadata

### User Experience
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Feedback**: Toast notifications for all actions
- **Auto-save**: Automatic draft saving every 5 seconds
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: Comprehensive error handling and user feedback

##  Project Structure

```
wellness-platform/
├── backend/                    # Node.js/Express API server
│   ├── controllers/           # Business logic controllers
│   │   ├── authController.js  # Authentication logic
│   │   └── sessionController.js # Session management logic
│   ├── middleware/            # Express middleware
│   │   ├── auth.js           # JWT authentication middleware
│   │   └── errorHandler.js   # Global error handling
│   ├── models/               # MongoDB/Mongoose models
│   │   ├── User.js          # User data model
│   │   └── Session.js       # Session data model
│   ├── routes/              # API route definitions
│   │   ├── auth.js         # Authentication routes
│   │   └── sessions.js     # Session management routes
│   ├── .env.example        # Environment variables template
│   ├── .gitignore         # Git ignore rules
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express server entry point
│
├── frontend/                  # React/TypeScript client
│   ├── public/               # Static assets
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable React components
│   │   │   ├── Navbar.tsx           # Navigation component
│   │   │   ├── ProtectedRoute.tsx   # Route protection wrapper
│   │   │   └── SessionCard.tsx      # Session display card
│   │   ├── context/          # React context providers
│   │   │   └── AuthContext.tsx      # Authentication state management
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.tsx        # Public sessions dashboard
│   │   │   ├── Login.tsx           # User login page
│   │   │   ├── Register.tsx        # User registration page
│   │   │   ├── MySessions.tsx      # User's session management
│   │   │   └── SessionEditor.tsx   # Session creation/editing
│   │   ├── App.tsx          # Main application component
│   │   ├── main.tsx         # React application entry point
│   │   └── index.css        # Global styles
│   ├── .env.example         # Frontend environment template
│   ├── package.json         # Frontend dependencies
│   ├── tsconfig.json        # TypeScript configuration
│   └── vite.config.ts       # Vite build configuration
│
└── README.md                 # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wellness-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment template and configure
   cp .env.example .env
   # Edit .env with your configuration (see Environment Variables section)
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Copy environment template and configure
   cp .env.example .env
   # Edit .env with your API URL
   ```

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/wellness-platform

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev  # Development mode with nodemon
   # or
   npm start    # Production mode
   ```
   Server will run on `http://localhost:5000`

3. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
   - Register a new account or login with existing credentials

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### Session Endpoints

All session endpoints require authentication via `Authorization: Bearer <token>` header.

#### GET `/api/sessions`
Get all published wellness sessions.

**Response:**
```json
{
  "sessions": [
    {
      "_id": "session_id",
      "title": "Morning Yoga Flow",
      "tags": ["yoga", "morning", "flexibility"],
      "json_file_url": "https://example.com/session.json",
      "status": "published",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "user_id": {
        "email": "author@example.com"
      }
    }
  ]
}
```

#### GET `/api/my-sessions`
Get current user's sessions (both drafts and published).

#### GET `/api/my-sessions/:id`
Get specific session by ID (user must own the session).

#### POST `/api/my-sessions/save-draft`
Create or update a session draft.

**Request Body:**
```json
{
  "title": "Session Title",
  "tags": ["tag1", "tag2"],
  "json_file_url": "https://example.com/session.json",
  "sessionId": "optional_existing_session_id"
}
```

#### POST `/api/my-sessions/publish`
Publish a draft session.

**Request Body:**
```json
{
  "sessionId": "session_id_to_publish"
}
```

## 🎯 Usage Guide

### For New Users

1. **Registration**
   - Navigate to the registration page
   - Provide email and secure password (min 6 chars, must include uppercase, lowercase, and number)
   - Account is created and you're automatically logged in

2. **Exploring Sessions**
   - Visit the Dashboard to browse published wellness sessions
   - Use search and filter features to find specific content
   - Click "View" on any session to see detailed information

### For Content Creators

1. **Creating Sessions**
   - Navigate to "My Sessions" from the navbar
   - Click "New Session" to open the session editor
   - Fill in session title, tags, and JSON file URL
   - Sessions auto-save as drafts every 5 seconds

2. **Managing Sessions**
   - View all your sessions in "My Sessions"
   - Edit existing sessions by clicking the "Edit" button
   - Publish drafts to make them visible to all users
   - Filter your sessions by status (draft/published)

3. **Session Editor Features**
   - **Auto-save**: Changes are automatically saved every 5 seconds
   - **Manual Save**: Click "Save as Draft" to save immediately
   - **Publishing**: Click "Publish Session" to make it public
   - **Status Indicators**: Visual feedback for save status and unsaved changes

## 🔧 Development

### Backend Development

The backend is built with:
- **Express.js**: Web framework
- **MongoDB/Mongoose**: Database and ODM
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **express-validator**: Input validation

Key files:
- [`server.js`](backend/server.js): Main server configuration
- [`models/User.js`](backend/models/User.js): User data model
- [`models/Session.js`](backend/models/Session.js): Session data model
- [`controllers/`](backend/controllers/): Business logic
- [`middleware/auth.js`](backend/middleware/auth.js): JWT authentication

### Frontend Development

The frontend is built with:
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **React Hot Toast**: Notifications

Key files:
- [`src/App.tsx`](frontend/src/App.tsx): Main application component
- [`src/context/AuthContext.tsx`](frontend/src/context/AuthContext.tsx): Authentication state
- [`src/pages/`](frontend/src/pages/): Page components
- [`src/components/`](frontend/src/components/): Reusable components

### Database Schema

#### User Model
```javascript
{
  email: String (required, unique),
  password_hash: String (required),
  created_at: Date (default: now)
}
```

#### Session Model
```javascript
{
  user_id: ObjectId (ref: User, required),
  title: String (required, max: 200),
  tags: [String] (max length: 50 each),
  json_file_url: String (required, URL),
  status: String (enum: ['draft', 'published'], default: 'draft'),
  created_at: Date (default: now),
  updated_at: Date (default: now)
}
```

## 🛠️ Scripts

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Frontend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or check your MongoDB Atlas connection string
   - Verify the `MONGODB_URI` in your `.env` file
   - Check firewall settings if using MongoDB Atlas

2. **JWT Token Issues**
   - Ensure `JWT_SECRET` is set in backend `.env`
   - Clear browser localStorage if experiencing auth issues
   - Check that the token is being sent in request headers

3. **CORS Errors**
   - Backend includes CORS middleware for all origins
   - Ensure frontend is making requests to the correct API URL
   - Check `VITE_API_URL` in frontend `.env`

4. **Port Conflicts**
   - Backend default port: 5000
   - Frontend default port: 5173
   - Change ports in respective configuration files if needed

5. **Auto-save Not Working**
   - Check browser console for JavaScript errors
   - Ensure stable internet connection
   - Verify authentication token is valid

### Development Tips

1. **Environment Setup**
   - Use different database names for development and production
   - Keep `.env` files out of version control
   - Use strong, unique JWT secrets

2. **Database Management**
   - Use MongoDB Compass for visual database management
   - Regularly backup your database
   - Monitor database performance and indexes

3. **Frontend Development**
   - Use React Developer Tools for debugging
   - Enable TypeScript strict mode for better type safety
   - Utilize Vite's hot module replacement for faster development

## 🔒 Security Features

- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation using express-validator
- **CORS Protection**: Configured for secure cross-origin requests
- **XSS Protection**: React's built-in XSS protection
- **Environment Variables**: Sensitive data stored in environment variables

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for the wellness community**