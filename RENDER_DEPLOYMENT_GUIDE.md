# 🚀 Deploy AI Timesheet Platform to Render

**Deployment Date:** November 10, 2025  
**Platform:** Render.com  
**Estimated Time:** 30-45 minutes

---

## 📋 Overview

We'll deploy 3 services on Render:
1. **Backend API** - Node.js/Express server
2. **Frontend** - React application
3. **MongoDB** - Database (via MongoDB Atlas)

---

## 🎯 Prerequisites

### Before Starting:

- [ ] GitHub account
- [ ] Render account (sign up at https://render.com)
- [ ] MongoDB Atlas account (sign up at https://www.mongodb.com/cloud/atlas)
- [ ] Your code pushed to GitHub repository
- [ ] Environment variables ready

---

## 📦 Step 1: Prepare Your Repository

### 1.1 Create `.gitignore` Files

**Backend `.gitignore`:**
```
node_modules/
.env
*.log
.DS_Store
dist/
build/
```

**Frontend `.gitignore`:**
```
node_modules/
build/
.env
.env.local
.env.production
.DS_Store
*.log
```

### 1.2 Push to GitHub

```bash
# Initialize git (if not already)
cd /path/to/your/project
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for Render deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/timesheet-platform.git
git branch -M main
git push -u origin main
```

---

## 🗄️ Step 2: Setup MongoDB Atlas

### 2.1 Create Database

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or login
3. Click **"Build a Database"**
4. Choose **"Shared"** (Free tier) or **"Dedicated"** (Production)
5. Select **Cloud Provider**: AWS
6. Select **Region**: Choose closest to your users (e.g., US East)
7. Cluster Name: `timesheet-db`
8. Click **"Create Cluster"** (takes 3-5 minutes)

### 2.2 Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `timesheet_admin`
5. Password: Generate secure password (save it!)
6. Database User Privileges: **"Atlas admin"** or **"Read and write to any database"**
7. Click **"Add User"**

### 2.3 Whitelist IP Addresses

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Note: For production, restrict to Render's IPs
4. Click **"Confirm"**

### 2.4 Get Connection String

1. Go to **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy connection string:
   ```
   mongodb+srv://timesheet_admin:<password>@timesheet-db.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name before `?`:
   ```
   mongodb+srv://timesheet_admin:YOUR_PASSWORD@timesheet-db.xxxxx.mongodb.net/timesheet?retryWrites=true&w=majority
   ```

**Save this connection string!** You'll need it for Render.

---

## 🖥️ Step 3: Deploy Backend API to Render

### 3.1 Create Backend Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub account if not already connected
4. Select your repository
5. Configure service:

**Basic Settings:**
- **Name**: `timesheet-backend`
- **Region**: Same as MongoDB (e.g., Oregon)
- **Branch**: `main`
- **Root Directory**: Leave empty (or specify if backend is in subfolder)
- **Runtime**: **Node**
- **Build Command**: `npm install`
- **Start Command**: `node server.js` (or `npm start`)

**Instance Type:**
- Free tier: Select **"Free"**
- Production: Select **"Starter"** ($7/month) or higher

### 3.2 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://timesheet_admin:YOUR_PASSWORD@timesheet-db.xxxxx.mongodb.net/timesheet?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
FRONTEND_URL=https://YOUR-FRONTEND-NAME.onrender.com
```

**Important:**
- `MONGO_URI`: Your MongoDB Atlas connection string from Step 2.4
- `JWT_SECRET`: Generate a strong secret (minimum 32 characters)
- `FRONTEND_URL`: We'll update this after deploying frontend

### 3.3 Create Backend

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait 3-5 minutes for first deployment
4. You'll see logs in real-time
5. Once deployed, you'll get a URL: `https://timesheet-backend.onrender.com`

### 3.4 Test Backend

```bash
# Test health endpoint
curl https://timesheet-backend.onrender.com/api/health

# Expected response:
# {"status":"ok","timestamp":"2025-11-10T..."}
```

---

## 🎨 Step 4: Deploy Frontend to Render

### 4.1 Update Frontend API URL

**Edit `src/services/api.js`:**

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT token interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
```

### 4.2 Create `.env.production` File

Create in frontend root:

```
REACT_APP_API_URL=https://timesheet-backend.onrender.com/api
```

### 4.3 Commit and Push Changes

```bash
git add .
git commit -m "Configure production API URL"
git push origin main
```

### 4.4 Create Frontend Service

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Select your repository
4. Configure:

**Basic Settings:**
- **Name**: `timesheet-frontend`
- **Branch**: `main`
- **Root Directory**: Leave empty (or specify frontend folder)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

**Environment Variables:**
```
REACT_APP_API_URL=https://timesheet-backend.onrender.com/api
```

### 4.5 Create Static Site

1. Click **"Create Static Site"**
2. Wait 3-5 minutes for build and deployment
3. You'll get a URL: `https://timesheet-frontend.onrender.com`

---

## 🔗 Step 5: Update CORS and URLs

### 5.1 Update Backend CORS

**Edit backend `server.js`:**

```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3000', // Development
    'https://timesheet-frontend.onrender.com' // Production
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 5.2 Update Backend Environment Variable

1. Go to Render Dashboard → **timesheet-backend**
2. Click **"Environment"** tab
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://timesheet-frontend.onrender.com
   ```
4. Click **"Save Changes"**
5. Render will automatically redeploy

### 5.3 Commit and Redeploy

```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render will automatically redeploy both services.

---

## ✅ Step 6: Verify Deployment

### 6.1 Test Backend Endpoints

```bash
# Health check
curl https://timesheet-backend.onrender.com/api/health

# Register test user
curl -X POST https://timesheet-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123",
    "role": "Employee",
    "department": "Engineering"
  }'

# Login
curl -X POST https://timesheet-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### 6.2 Test Frontend

1. Open `https://timesheet-frontend.onrender.com`
2. Try to login with test credentials
3. Navigate through pages
4. Check browser console for errors

### 6.3 Create Admin Account

**Option 1: Via Backend API**
```bash
curl -X POST https://timesheet-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@timesheet.com",
    "password": "Admin@123",
    "role": "Admin",
    "department": "Management"
  }'
```

**Option 2: Via MongoDB Atlas**
1. Go to MongoDB Atlas → Database → Browse Collections
2. Find `users` collection
3. Find your user document
4. Edit: Change `role` to `"Admin"`

---

## 🔒 Step 7: Security Configuration

### 7.1 Set Strong JWT Secret

Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update in Render:
1. Backend → Environment → `JWT_SECRET`
2. Use the generated value

### 7.2 Enable HTTPS Only

Both Render services automatically use HTTPS. Verify:
- Backend: `https://` only
- Frontend: `https://` only

### 7.3 Restrict MongoDB Access (Production)

1. MongoDB Atlas → Network Access
2. Remove `0.0.0.0/0` entry
3. Add Render's IP ranges (get from Render support)

### 7.4 Set Environment-Specific Configs

Backend `.env` (for reference):
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-here
JWT_EXPIRE=7d
FRONTEND_URL=https://timesheet-frontend.onrender.com
```

---

## 📊 Step 8: Monitor and Maintain

### 8.1 View Logs

**Backend Logs:**
1. Render Dashboard → timesheet-backend
2. Click **"Logs"** tab
3. Real-time logs visible

**Frontend Logs:**
1. Render Dashboard → timesheet-frontend
2. Click **"Logs"** tab
3. Build and deploy logs

### 8.2 Set Up Alerts

1. Render Dashboard → Service Settings
2. **"Notifications"** section
3. Add email for deploy failures

### 8.3 Monitor Performance

**Free Tier Limitations:**
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Solution: Upgrade to paid plan ($7/month) for 24/7 uptime

**Check Service Health:**
- Render shows uptime and response times
- Set up external monitoring with Uptime Robot or StatusCake

### 8.4 Database Backups

**MongoDB Atlas:**
1. Dashboard → Backup
2. Enable automatic backups (available on paid tiers)
3. Free tier: Manual exports via `mongodump`

---

## 🔄 Step 9: Continuous Deployment

### 9.1 Auto-Deploy on Push

Render automatically deploys when you push to `main` branch:

```bash
# Make changes
git add .
git commit -m "Update feature X"
git push origin main

# Render auto-deploys in 2-5 minutes
```

### 9.2 Manual Deploy

If needed:
1. Render Dashboard → Service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### 9.3 Rollback

If deployment fails:
1. Render Dashboard → Service
2. **"Events"** tab
3. Find previous successful deploy
4. Click **"Rollback"**

---

## 🌐 Step 10: Custom Domain (Optional)

### 10.1 Add Custom Domain

**For Frontend:**
1. Render Dashboard → timesheet-frontend
2. **"Settings"** → **"Custom Domains"**
3. Click **"Add Custom Domain"**
4. Enter your domain: `timesheet.yourdomain.com`
5. Render provides CNAME records

**For Backend:**
1. Render Dashboard → timesheet-backend
2. **"Settings"** → **"Custom Domains"**
3. Add: `api.yourdomain.com`

### 10.2 Update DNS

At your domain registrar:
```
Type: CNAME
Name: timesheet
Value: timesheet-frontend.onrender.com

Type: CNAME
Name: api
Value: timesheet-backend.onrender.com
```

### 10.3 Update Environment Variables

After custom domain is active:

Backend:
```
FRONTEND_URL=https://timesheet.yourdomain.com
```

Frontend:
```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

---

## 🐛 Troubleshooting

### Issue 1: Backend Won't Start

**Symptoms:** Deployment fails, logs show errors

**Solutions:**
1. Check `package.json` has correct `start` script:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```
2. Verify all environment variables are set
3. Check MongoDB connection string is correct
4. Ensure `PORT` is read from environment:
   ```javascript
   const PORT = process.env.PORT || 5000;
   ```

### Issue 2: Frontend Shows API Errors

**Symptoms:** CORS errors, 404s, connection refused

**Solutions:**
1. Verify `REACT_APP_API_URL` is set correctly
2. Check CORS configuration in backend includes frontend URL
3. Test backend API directly with curl
4. Check browser console for exact error

### Issue 3: Database Connection Fails

**Symptoms:** "MongoNetworkError", "Authentication failed"

**Solutions:**
1. Verify MongoDB connection string is correct
2. Check username and password (no special characters unescaped)
3. Verify IP whitelist includes `0.0.0.0/0` or Render IPs
4. Test connection string locally first

### Issue 4: Environment Variables Not Working

**Symptoms:** `undefined` values in code

**Solutions:**
1. Render: Click "Save Changes" after adding variables
2. Frontend: Variables must start with `REACT_APP_`
3. Rebuild/redeploy after adding variables
4. Check variable names for typos

### Issue 5: Slow Initial Load

**Symptoms:** First request takes 30-60 seconds

**Solution:**
- Free tier services sleep after 15 minutes
- Upgrade to Starter plan ($7/month) for 24/7 uptime
- Or use a service like Uptime Robot to ping every 5 minutes

---

## 💰 Pricing Breakdown

### Free Tier:
- **Backend:** Free (with sleep after 15 min inactivity)
- **Frontend:** Free
- **MongoDB Atlas:** Free (512MB storage)
- **Total:** $0/month

**Limitations:**
- Backend sleeps after 15 minutes
- 750 hours/month backend runtime
- 100GB bandwidth/month

### Production Tier:
- **Backend:** Starter ($7/month) - 24/7, no sleep
- **Frontend:** Free (static sites always free)
- **MongoDB Atlas:** Shared M2 ($9/month) or Dedicated M10 ($57/month)
- **Total:** $16-64/month

**Benefits:**
- 24/7 uptime
- Better performance
- More storage and bandwidth
- Backups (MongoDB)

---

## 📝 Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] MongoDB connected successfully
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] Admin account created
- [ ] Test login with all roles (Employee, Manager, Admin, Finance)
- [ ] Test timesheet creation
- [ ] Test approval workflow
- [ ] Test invoice generation
- [ ] Test payment recording
- [ ] Test audit logs
- [ ] Check all API endpoints working
- [ ] Browser console shows no errors
- [ ] Set up monitoring alerts
- [ ] Document URLs and credentials
- [ ] Backup database

---

## 🎯 Final URLs

After deployment, save these:

```
Frontend: https://timesheet-frontend.onrender.com
Backend API: https://timesheet-backend.onrender.com/api
MongoDB: mongodb+srv://timesheet-admin:...@timesheet-db.xxxxx.mongodb.net/timesheet

Admin Login:
Email: admin@timesheet.com
Password: Admin@123

Render Dashboard: https://dashboard.render.com
MongoDB Atlas: https://cloud.mongodb.com
```

---

## 🚀 You're Live!

Congratulations! Your AI Timesheet Platform is now deployed and accessible worldwide. 

**Share with your team:**
- Frontend URL
- Test credentials
- User guide: `DEMO_GUIDE.md`

**Next steps:**
- Invite users
- Monitor usage
- Gather feedback
- Plan Phase 1.5 enhancements

---

## 📞 Support Resources

- **Render Documentation:** https://render.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Render Status:** https://status.render.com
- **Community Support:** https://community.render.com

---

**Deployment Complete! 🎉**

**Total Time:** 30-45 minutes  
**Status:** Production-Ready  
**Cost:** Free tier or $16-64/month for production
