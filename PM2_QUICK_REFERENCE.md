# PM2 Quick Reference - Dr. Infinity AI

## 🚀 **ONE-COMMAND DEPLOYMENT**

```bash
cd /opt/drinfinityai && pm2 start ecosystem.config.js
```

This starts both backend and frontend together!

---

## 📊 **Most Common Commands**

### Start/Stop/Restart
```bash
pm2 start ecosystem.config.js    # Start both services
pm2 restart all                   # Restart both services
pm2 stop all                      # Stop both services
pm2 delete all                    # Remove all from PM2
```

### Check Status
```bash
pm2 status                        # Show all services
pm2 list                          # Same as status
```

### View Logs
```bash
pm2 logs                          # All logs (live)
pm2 logs --lines 100              # Last 100 lines
pm2 logs drinfinity-ai-backend    # Backend only
pm2 logs drinfinity-ai-frontend   # Frontend only
```

### Monitor
```bash
pm2 monit                         # Live resource monitor
```

---

## 🔄 **Update Workflow**

```bash
cd /opt/drinfinityai
git pull                          # Get latest code
cd frontend && npm install && npm run build && cd ..
cd backend && source venv/bin/activate && pip install -r requirements.txt && deactivate && cd ..
pm2 restart all                   # Restart services
pm2 logs                          # Check logs
```

---

## 🛠️ **Individual Service Control**

### Backend Only
```bash
pm2 restart drinfinity-ai-backend
pm2 stop drinfinity-ai-backend
pm2 logs drinfinity-ai-backend
```

### Frontend Only
```bash
pm2 restart drinfinity-ai-frontend
pm2 stop drinfinity-ai-frontend
pm2 logs drinfinity-ai-frontend
```

---

## 💾 **Save & Startup**

```bash
pm2 save                          # Save current process list
pm2 startup                       # Generate startup script
                                  # Then run the command it outputs!
```

---

## 🚨 **Emergency Commands**

### Service Not Responding
```bash
pm2 delete all                    # Remove all
cd /opt/drinfinityai
pm2 start ecosystem.config.js    # Start fresh
```

### Check What's Running on Ports
```bash
sudo lsof -i :8000                # Backend port
sudo lsof -i :3000                # Frontend port
```

### Clear Logs
```bash
pm2 flush                         # Clear all logs
```

---

## 📈 **Production Best Practices**

### Save After Any Change
```bash
pm2 restart all
pm2 save                          # Always save after restart!
```

### Monitor Memory Usage
```bash
pm2 monit                         # Press Ctrl+C to exit
```

### Check Health Regularly
```bash
curl http://localhost:8000/health  # Backend health
curl http://localhost:3000         # Frontend health
```

---

## 🎯 **Quick Test After Deployment**

```bash
# 1. Check services are running
pm2 status

# 2. Check backend health
curl http://localhost:8000/health

# 3. Check frontend
curl http://localhost:3000

# 4. View logs for errors
pm2 logs --lines 50

# 5. Test the live site
curl https://ai.drinfinityai.com
```

---

## 📂 **File Locations**

```
/opt/drinfinityai/ecosystem.config.js   ← Main PM2 config
/opt/drinfinityai/backend/logs/         ← Backend logs
/opt/drinfinityai/frontend/logs/        ← Frontend logs
```

---

## 💡 **Pro Tips**

1. **Always check logs after restart**: `pm2 logs --lines 50`
2. **Save PM2 list after changes**: `pm2 save`
3. **Use unified config**: Start from root with `ecosystem.config.js`
4. **Monitor resources**: `pm2 monit` to catch memory leaks
5. **Graceful restarts**: `pm2 reload all` (zero-downtime for frontend)

---

## 🆘 **Help**

```bash
pm2 --help                        # General help
pm2 start --help                  # Start command help
pm2 logs --help                   # Logs command help
```

---

**Quick Access**: Save this file and `cat PM2_QUICK_REFERENCE.md` anytime!

