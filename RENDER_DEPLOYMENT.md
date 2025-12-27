# Render Deployment Guide for Latin Dance Management System

## Prerequisites

1. **MongoDB Atlas Account**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Render Account**: Sign up at [Render](https://render.com)
3. **GitHub Repository**: Push your code to GitHub

## Step 1: Setup MongoDB Atlas

1. Create a new cluster in MongoDB Atlas
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) for Render access
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/latin-dance`

## Step 2: Deploy Backend to Render

### Option A: Using Render Dashboard

1. **Create New Web Service**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Select the `BACKEND` folder as root directory

2. **Configure Service**
   - **Name**: `latin-dance-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/latin-dance
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   CORS_ORIGIN=https://your-frontend-app.onrender.com
   ```

4. **Deploy**: Click "Create Web Service"

### Option B: Using render.yaml (Infrastructure as Code)

1. Place `render.yaml` in your BACKEND folder
2. Connect repository to Render
3. Render will auto-detect the configuration

## Step 3: Deploy Frontend to Render

1. **Create New Static Site**
   - Go to Render Dashboard → New → Static Site
   - Connect your GitHub repository
   - Select the `FRONTEND` folder as root directory

2. **Configure Service**
   - **Name**: `latin-dance-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-app.onrender.com/api
   ```

4. **Deploy**: Click "Create Static Site"

## Step 4: Update Environment Variables

### Backend Environment Variables
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/latin-dance?retryWrites=true&w=majority
JWT_SECRET=generate-a-strong-random-secret-key-at-least-32-characters-long
CORS_ORIGIN=https://latin-dance-frontend.onrender.com
```

### Frontend Environment Variables
```bash
VITE_API_URL=https://latin-dance-backend.onrender.com/api
```

## Step 5: Post-Deployment Setup

1. **Test Backend Health**
   ```bash
   curl https://your-backend-app.onrender.com/api/health
   ```

2. **Seed Database** (Optional)
   - SSH into your backend service or run locally:
   ```bash
   node seed.js
   ```

3. **Create Admin User**
   ```bash
   node create-admin.js
   ```

## Step 6: Custom Domain (Optional)

1. **Backend**: Add custom domain in Render dashboard
2. **Frontend**: Add custom domain in Render dashboard
3. **Update Environment Variables**: Replace `.onrender.com` URLs with your custom domains

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` matches your frontend URL exactly
   - Check that both HTTP and HTTPS are handled

2. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Ensure IP whitelist includes 0.0.0.0/0
   - Check database user permissions

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Review build logs in Render dashboard

4. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify JWT_SECRET is sufficiently long

### Monitoring

1. **Logs**: Check Render dashboard for service logs
2. **Health Checks**: Monitor `/api/health` endpoint
3. **Database**: Monitor MongoDB Atlas metrics

## Security Checklist

- ✅ Strong JWT_SECRET (32+ characters)
- ✅ MongoDB Atlas IP whitelist configured
- ✅ CORS properly configured
- ✅ Environment variables secured
- ✅ HTTPS enabled (automatic on Render)

## Performance Optimization

1. **Backend**
   - Enable compression middleware
   - Add request rate limiting
   - Implement database indexing

2. **Frontend**
   - Enable Vite build optimizations
   - Configure CDN for static assets
   - Implement lazy loading

## Backup Strategy

1. **Database**: Enable MongoDB Atlas automated backups
2. **Code**: Maintain GitHub repository
3. **Environment**: Document all environment variables

## Support

- **Render Documentation**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Project Issues**: Check application logs and health endpoints

---

**Deployment URLs:**
- Backend: `https://your-backend-app.onrender.com`
- Frontend: `https://your-frontend-app.onrender.com`
- Health Check: `https://your-backend-app.onrender.com/api/health`