# FIXED VERSION - Redis Version Issue Resolved

## ✅ Apa yang Sudah Diperbaiki?

Dashboard ini sudah di-patch untuk mengatasi error **`unknown command 'BZPOPMIN'`** yang terjadi karena Redis versi lama (MSI Windows).

### Perubahan:
1. **WebSocket DISABLED** - menggunakan InMemoryChannelLayer
2. **MQTT Client DISABLED** - untuk mencegah conflict
3. **Dashboard tetap berfungsi** dengan REST API polling setiap 5 detik

## 🚀 Cara Menggunakan (SIMPLE!)

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt

cd ../frontend
npm install
```

### 2. Setup Database

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 3. Jalankan Aplikasi

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - MQTT Test (Optional):**
```bash
python mqtt_test_publisher.py
```

### 4. Buka Dashboard

http://localhost:5173

---

## 📊 Cara Kerja Sekarang

- ✅ Dashboard fetch data via REST API setiap 5 detik
- ✅ Data tetap update otomatis
- ✅ Tidak perlu Redis
- ✅ Tidak ada error WebSocket
- ❌ Tidak real-time (delay 5 detik)

---

## 🔄 Cara Enable Real-Time WebSocket (Optional)

Jika ingin WebSocket real-time, upgrade Redis dulu:

### Opsi 1: Docker (Recommended)

```bash
# Install Docker Desktop
# Start Docker Desktop
# Jalankan Redis terbaru:
docker run -d -p 6379:6379 redis:latest
```

### Opsi 2: Redis Terbaru untuk Windows

Download dari: https://github.com/tporadowski/redis/releases  
Install **Redis-x64-5.0.14.1.msi** atau lebih baru

### Lalu Enable WebSocket:

**File: `backend/rectifier_monitor/settings.py`**

Ubah:
```python
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}
```

Jadi:
```python
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}
```

**File: `backend/monitor/apps.py`**

Uncomment bagian start_mqtt_client

---

## 🆘 Troubleshooting

### Dashboard tidak muncul data
- Jalankan `mqtt_test_publisher.py` untuk generate data test
- Atau publish data via MQTTX ke topic `rectifier/data`

### Backend error database
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Port sudah dipakai
- Backend: `python manage.py runserver 8001`
- Frontend: edit `vite.config.js`, ubah port

---

## 📞 Support

Jika masih ada masalah, cek file `README.md` untuk dokumentasi lengkap.
