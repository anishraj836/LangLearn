# Render Deployment Guide for LangLearn

## Render Configuration

### For Backend API Deployment:

**Build Command:**
```bash
npm run render-build
```

**Start Command:**
```bash
npm run render-start
```

**Environment Variables:**
```
PORT=10000
URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
STEAM_API_KEY=your_stream_api_key
STEAM_API_SECRET=your_stream_api_secret
NODE_ENV=production
```

### For Frontend Deployment:

**Build Command:**
```bash
npm run build:frontend
```

**Publish Directory:**
```
frontend/dist
```

**Environment Variables:**
```
VITE_STREAM_API_KEY=your_stream_api_key
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## Alternative Deployment Method

If you're still having issues, you can deploy the backend separately:

### Backend Only Deployment:

**Root Directory:** `backend`

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Environment Variables:** (same as above)

### Frontend Only Deployment:

**Root Directory:** `frontend`

**Build Command:**
```bash
npm install && npm run build
```

**Publish Directory:**
```
dist
```

## Important Notes:

1. **CORS Configuration**: Make sure your backend CORS settings include your frontend URL
2. **Environment Variables**: Set all required environment variables in Render dashboard
3. **Database**: Use MongoDB Atlas for production database
4. **Stream Keys**: Use production Stream API keys, not development ones

## Troubleshooting:

- If you get module not found errors, ensure the root directory is set correctly
- If build fails, check that all dependencies are properly listed in package.json
- If start fails, verify the start script exists in the target package.json 