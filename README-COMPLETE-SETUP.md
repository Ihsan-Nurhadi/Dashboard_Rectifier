# Complete Setup Guide - Rectifier Monitoring System

Dashboard monitoring real-time lengkap dengan Django backend, Next.js frontend, dan MQTT integration.

## 📦 Yang Ada di Package Ini

```
rectifier-monitoring/
├── backend/                    # Django REST API
│   ├── monitor/               # Main app
│   ├── rectifier_monitor/     # Settings
│   └── requirements.txt
├── frontend-nextjs/           # Next.js Dashboard (NEW!)
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── mqtt_complete_publisher.py # MQTT test data generator (NEW!)
└── README-COMPLETE-SETUP.md   # This file
```

## 🎯 Features Lengkap

### Backend (Django):
- ✅ REST API untuk semua data
- ✅ MQTT subscriber (dapat disabled)
- ✅ Database SQLite untuk storage
- ✅ Admin interface
- ✅ CORS enabled untuk frontend

### Frontend (Next.js):
- ✅ Real-time dashboard
- ✅ Site info dengan map
- ✅ Environment monitoring
- ✅ Module status (6 modules)
- ✅ Rectifier measurements
- ✅ Battery banks (3 banks)
- ✅ Responsive design
- ✅ TypeScript

### MQTT Publisher:
- ✅ Generate data lengkap
- ✅ Semua 50+ parameters
- ✅ Realistic random values
- ✅ Auto-retry connection

## 🚀 Quick Start (5 Menit)

### 1. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate
venv\Scripts\activate          # Windows
source venv/bin/activate       # Linux/Mac

# Install
pip install -r requirements.txt

# Setup database
python manage.py makemigrations
python manage.py migrate

# Run server
python manage.py runserver
```

Backend akan jalan di: **http://localhost:8000**

### 2. Setup Frontend

```bash
cd frontend-nextjs

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend akan jalan di: **http://localhost:3000**

### 3. Generate Test Data

```bash
# Di root project (terminal baru)
python mqtt_complete_publisher.py
```

Publisher akan mengirim data setiap 2 detik.

### 4. Open Dashboard

Buka browser: **http://localhost:3000**

Dashboard akan menampilkan data real-time!

---

## 📊 Data Flow

```
MQTT Broker (broker.emqx.io)
    ↓
Django Backend (port 8000)
    ↓ REST API
Next.js Frontend (port 3000)
    ↓
Your Browser
```

---

## 🔧 Detailed Setup

### Backend Setup Detail

```bash
cd backend

# 1. Virtual environment
python -m venv venv
venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Database migrations
python manage.py makemigrations monitor
python manage.py migrate

# 4. (Optional) Create admin user
python manage.py createsuperuser

# 5. Run server
python manage.py runserver
```

**Test backend:**
```bash
curl http://localhost:8000/api/rectifier/dashboard/
```

### Frontend Setup Detail

```bash
cd frontend-nextjs

# 1. Install dependencies
npm install

# 2. (Optional) Copy environment file
# Already created, but you can edit .env.local

# 3. Run development
npm run dev

# Or build for production
npm run build
npm start
```

**Test frontend:**
- Open http://localhost:3000
- You should see "Loading..." then dashboard

---

## 📡 MQTT Configuration

### Default Configuration (Public Broker)

**Backend:** `backend/rectifier_monitor/settings.py`
```python
MQTT_BROKER = 'broker.emqx.io'
MQTT_PORT = 1883
MQTT_TOPIC = 'rectifier/data'
```

**Publisher:** `mqtt_complete_publisher.py`
```python
MQTT_BROKER = "broker.emqx.io"
MQTT_PORT = 1883
MQTT_TOPIC = "rectifier/data"
```

### Menggunakan Broker Sendiri

Edit kedua file di atas, ganti dengan broker Anda:

```python
MQTT_BROKER = "your-broker.com"
MQTT_PORT = 1883
MQTT_TOPIC = "your/topic"
```

---

## 🗂️ Data Structure

### Complete MQTT Payload (50+ fields):

```json
{
  "ts": 1771141882067,
  
  "site_name": "NYK_WORKSHOP",
  "project_id": "23XL05C0027",
  "ladder": "Ladder-1",
  "sla": "2 Hour",
  "status_realtime": "Normal",
  "status_ladder": "Normal",
  "latitude": -6.305489,
  "longitude": 106.958651,
  
  "door_cabinet": "Close",
  "battery_stolen": "Close",
  "temperature": 33.2,
  "humidity": 62.5,
  
  "vac_input_l1": 220.5,
  "vac_input_l2": 218.3,
  "vac_input_l3": null,
  "vdc_output": 54.2,
  "battery_current": -0.5,
  "load_current": 63.7,
  "load_power": 3.45,
  
  "battery_bank_1_voltage": 53.4,
  "battery_bank_1_current": 0,
  "battery_bank_1_soc": 100,
  "battery_bank_1_soh": 100,
  
  "modules_status": [
    {"id": 1, "status": "Normal", "value": "LK23290..."},
    {"id": 2, "status": "Fault", "value": "LK23140..."}
  ]
}
```

### API Endpoints:

- `GET /api/rectifier/dashboard/` - Complete dashboard data
- `GET /api/rectifier/latest/` - Latest single record
- `GET /api/rectifier/stats/` - Statistics
- `GET /api/rectifier/chart_data/` - Chart data
- `GET /api/rectifier/` - All records (with limit)

---

## 🔍 Troubleshooting

### Backend Issues

**Error: No such table**
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

**Error: MQTT connection failed**
- Cek internet connection
- MQTT disabled by default (OK untuk testing)
- Enable jika perlu di `settings.py` dan `apps.py`

**Error: Port 8000 sudah dipakai**
```bash
python manage.py runserver 8001
# Don't forget to update frontend .env.local
```

### Frontend Issues

**Error: Connection Error**
- Pastikan backend running: `http://localhost:8000`
- Test: `curl http://localhost:8000/api/rectifier/dashboard/`
- Cek `.env.local` API URL

**Error: No data available**
- Jalankan MQTT publisher
- Atau add data manual via Django admin

**Error: Port 3000 sudah dipakai**
```bash
PORT=3001 npm run dev
```

### MQTT Publisher Issues

**Error Code 4 (Bad username/password)**
- Remove username/password untuk public broker
- Cek credentials untuk private broker

**Error Code 5 (Not authorized)**
- Client ID conflict - script sudah handle dengan random ID
- Coba broker lain (uncomment di script)

---

## 📝 Customization

### Change Polling Interval

**Frontend:** `frontend-nextjs/src/hooks/useDashboardData.ts`
```typescript
const interval = setInterval(() => {
  fetchData();
}, 2000); // Change to 5000 for 5 seconds
```

### Change Site Name

**Publisher:** `mqtt_complete_publisher.py`
```python
"site_name": "YOUR_SITE_NAME",
"project_id": "YOUR_PROJECT_ID",
```

### Add More Parameters

1. **Backend Model:** `backend/monitor/models.py` - add field
2. **Serializer:** `backend/monitor/serializers.py` - add to serializer
3. **Frontend Types:** `frontend-nextjs/src/types/index.ts` - add type
4. **Publisher:** `mqtt_complete_publisher.py` - add to payload
5. **Migration:** `python manage.py makemigrations && migrate`

---

## 🎨 Frontend Components

Dashboard terdiri dari 5 card utama:

1. **SiteInfoCard** - Site info + map
2. **EnvironmentStatusCard** - Temperature, humidity, door status
3. **RectifierModuleStatusCard** - 6 module status
4. **RectifierStatusCard** - AC input, DC output, load
5. **BatteryStatusCard** - 3 battery banks + SOC

Semua components di: `frontend-nextjs/src/components/dashboard/`

---

## 🚦 Production Deployment

### Backend (Django)

```bash
# Use production settings
export DEBUG=False
export SECRET_KEY=your-secret-key

# Use PostgreSQL instead of SQLite
# Update DATABASES in settings.py

# Collect static files
python manage.py collectstatic

# Use gunicorn or uwsgi
gunicorn rectifier_monitor.wsgi
```

### Frontend (Next.js)

```bash
# Build
npm run build

# Run production
npm start

# Or deploy to Vercel/Netlify
```

**Update API URL:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.com/api
```

---

## 📞 Support

### Check Logs

**Backend:**
- Terminal output dari `python manage.py runserver`
- Check `/admin/` untuk lihat data di database

**Frontend:**
- Browser console (F12)
- Network tab untuk API calls

**MQTT:**
- Publisher terminal output
- Django backend akan log received messages

### Common Commands

```bash
# Backend
cd backend
venv\Scripts\activate
python manage.py runserver

# Frontend  
cd frontend-nextjs
npm run dev

# Publisher
python mqtt_complete_publisher.py

# Check API
curl http://localhost:8000/api/rectifier/dashboard/

# Reset database
cd backend
rm db.sqlite3
python manage.py migrate
```

---

## 🎯 Summary

**3 Terminal untuk Run:**

```bash
# Terminal 1: Backend
cd backend && venv\Scripts\activate && python manage.py runserver

# Terminal 2: Frontend
cd frontend-nextjs && npm run dev

# Terminal 3: Publisher
python mqtt_complete_publisher.py
```

**Then open:** http://localhost:3000

Enjoy your real-time rectifier dashboard! 🎉
