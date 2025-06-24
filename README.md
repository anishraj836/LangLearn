# LangLearn 🌍

A modern language learning platform that connects people worldwide for language exchange through chat, video calls, and friendship building.

🔗 Try it now: LangLearn on Render
## ✨ Features

### Core Functionality
- **User Authentication & Onboarding** - Secure signup/login with comprehensive profile setup
- **Friend System** - Send, accept, and manage friend requests
- **Real-time Chat** - Powered by Stream Chat with message history and threading
- **Video Calls** - High-quality video calling using Stream Video SDK
- **User Recommendations** - Discover language partners based on native/learning languages
- **Notifications** - Real-time friend request notifications and updates

### User Experience
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Dark/Light Theme** - Customizable theme with smooth transitions
- **Modern UI** - Built with DaisyUI and Tailwind CSS for beautiful, accessible interfaces
- **Real-time Updates** - Live notifications and status updates

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **TanStack Query** - Server state management and caching
- **Axios** - HTTP client for API communication
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library built on Tailwind
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

### Real-time Communication
- **Stream Chat** - Real-time messaging platform
- **Stream Video** - Video calling and conferencing
- **WebRTC** - Peer-to-peer communication

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development server with auto-restart
- **Dotenv** - Environment variable management

## 📁 Project Structure

```
LangLearn/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and API
│   │   ├── store/          # State management
│   │   └── constants/      # App constants
│   └── public/             # Static assets
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── lib/            # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Stream account (for chat and video features)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LangLearn
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=5001
   URI=your_mongodb_connection_string
   JWT_SECRET_KEY=your_jwt_secret
   STEAM_API_KEY=your_stream_api_key
   STEAM_API_SECRET=your_stream_api_secret
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_STREAM_API_KEY=your_stream_api_key
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/onboarding` - Complete user profile
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get recommended users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/friends` - Get user's friends
- `GET /api/users/friend-requests` - Get friend requests
- `GET /api/users/outgoing-friend-requests` - Get outgoing requests
- `POST /api/users/friend-request/:id` - Send friend request
- `POST /api/users/friend-request/:id/accept` - Accept friend request
- `POST /api/users/friend-request/:id/reject` - Reject friend request

### Chat
- `GET /api/chat/token` - Get Stream chat token

## 🌟 Key Features Explained

### Language Exchange Matching
Users are matched based on:
- **Native Language** - What language they speak fluently
- **Learning Language** - What language they want to learn
- **Geographic Location** - Proximity for better connection
- **Profile Completeness** - Only onboarded users are recommended

### Real-time Communication
- **Chat System** - Persistent messaging with read receipts
- **Video Calls** - High-quality video calling with screen sharing
- **Notifications** - Real-time updates for friend requests and messages

### User Experience
- **Onboarding Flow** - Guided profile setup with language preferences
- **Friend Management** - Easy friend request system with notifications
- **Responsive Design** - Works on all devices and screen sizes

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Server-side validation for all inputs
- **Protected Routes** - Authentication middleware for sensitive endpoints

## 🎨 UI/UX Highlights

- **Modern Design** - Clean, intuitive interface
- **Theme Support** - Dark and light mode
- **Responsive Layout** - Mobile-first design approach
- **Loading States** - Smooth loading animations
- **Error Handling** - User-friendly error messages
- **Accessibility** - WCAG compliant components

## 🚀 Deployment

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or DigitalOcean
- Set up MongoDB Atlas for database
- Configure environment variables
- Set up Stream account for chat/video features

### Frontend Deployment
- Deploy to Vercel, Netlify, or similar platforms
- Configure environment variables
- Set up custom domain (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Stream** for providing excellent chat and video SDKs
- **DaisyUI** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **React community** for the amazing ecosystem

---

**Built with ❤️ for language learners worldwide** 
