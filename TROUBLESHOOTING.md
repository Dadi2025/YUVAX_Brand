# Error 4091 - Port Already in Use

## What's Happening

Error code 4091 means **port 5000 is already in use**. This is because the server is already running from when we started it earlier with `npm run dev`.

## ✅ Good News

**Your server is already running and working perfectly!** 

You can see it's serving requests:
- Products API is responding: `GET /api/products 200`
- MongoDB is connected
- Everything is working

## Solutions

### Option 1: Keep Using the Running Server (Recommended)

**Do nothing!** Your server is already running and working. Just use your application at:
- Frontend: http://localhost:5174
- Backend: http://localhost:5000

### Option 2: Stop and Restart

If you want to restart the server:

1. **Find the running process:**
   ```powershell
   netstat -ano | findstr :5000
   ```

2. **Kill the process:**
   ```powershell
   taskkill /PID <process_id> /F
   ```
   Replace `<process_id>` with the number from step 1.

3. **Then start with npm start:**
   ```bash
   npm start
   ```

### Option 3: Use a Different Port

Edit `server/.env` and change:
```env
PORT=5001
```

Then you can run both servers simultaneously.

## Understanding npm Commands

- **`npm run dev`** - Runs with nodemon (auto-restarts on file changes) ✅ Better for development
- **`npm start`** - Runs with node (no auto-restart) - Better for production

## Quick Check

**Is the server working?**
Open in browser: http://localhost:5000

You should see:
```json
{
  "message": "YUVAX API is running",
  "version": "1.0.0",
  "environment": "development"
}
```

If you see this, your server is working perfectly! No need to restart.
