# Rectifier Dashboard - Next.js Frontend

Dashboard monitoring real-time untuk rectifier dengan Next.js + TypeScript yang terhubung ke Django backend.

## 🚀 Features

- ✅ Real-time data polling setiap 2 detik
- ✅ Complete dashboard dengan semua parameter
- ✅ Site info, Environment, Modules, Rectifier, Battery status
- ✅ Interactive map dengan location
- ✅ Loading dan error states
- ✅ Responsive design
- ✅ TypeScript untuk type safety

## 📦 Prerequisites

- Node.js 18+ 
- Django backend running di `http://localhost:8000`
- MQTT publisher mengirim data lengkap

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local .env.local

# Edit .env.local if needed (default: http://localhost:8000/api)
```

## 🚦 Running

### Development

```bash
npm run dev
```

Dashboard akan buka di: **http://localhost:3000**

### Production Build

```bash
npm run build
npm start
```

## 🔗 Backend Connection

Frontend akan connect ke Django backend di URL yang di-set di `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### API Endpoints yang Digunakan:

- `GET /api/rectifier/dashboard/` - Dashboard data lengkap
- `GET /api/rectifier/latest/` - Data terbaru
- `GET /api/rectifier/stats/` - Statistik
- `GET /api/rectifier/chart_data/` - Data untuk chart

## 📊 Data Structure

Frontend menggunakan struktur data TypeScript (lihat `src/types/index.ts`):

```typescript
interface DashboardData {
  siteInfo: SiteInfo;
  environment: EnvironmentStatus;
  modules: RectifierModule[];
  rectifier: RectifierStatus;
  battery: BatteryStatus;
}
```

## 🧪 Testing dengan Data Dummy

Jalankan MQTT publisher untuk generate data test:

```bash
# Di root project
python mqtt_complete_publisher.py
```

Publisher akan mengirim data lengkap setiap 2 detik ke MQTT broker, yang akan diterima oleh Django backend dan ditampilkan di frontend.

## 🔧 Configuration

### Change API URL

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend.com/api
```

### Change Polling Interval

Edit `src/hooks/useDashboardData.ts`:

```typescript
const interval = setInterval(() => {
  fetchData();
}, 2000); // Change to your preferred interval (ms)
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main dashboard page
│   └── layout.tsx         # Root layout
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── SiteInfoCard.tsx
│   │   ├── EnvironmentStatusCard.tsx
│   │   ├── RectifierModuleStatusCard.tsx
│   │   ├── RectifierStatusCard.tsx
│   │   └── BatteryStatusCard.tsx
│   ├── layout/
│   │   └── Header.tsx
│   └── ui/                # Reusable UI components
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── MetricItem.tsx
│       ├── StatusIndicator.tsx
│       └── Map.tsx
├── hooks/
│   └── useDashboardData.ts  # Data fetching hook
├── services/
│   └── api.ts             # API service layer
├── types/
│   └── index.ts           # TypeScript type definitions
└── lib/
    └── utils.ts           # Utility functions
```

## 🆘 Troubleshooting

### "Connection Error" di Dashboard

**Problem:** Frontend tidak bisa connect ke backend

**Solution:**
1. Pastikan Django backend running di `http://localhost:8000`
2. Test API: `curl http://localhost:8000/api/rectifier/dashboard/`
3. Cek CORS settings di Django backend
4. Cek `.env.local` API URL

### "No data available"

**Problem:** Backend running tapi no data

**Solution:**
1. Jalankan MQTT publisher: `python mqtt_complete_publisher.py`
2. Cek Django logs untuk error MQTT
3. Pastikan data tersimpan: visit `http://localhost:8000/admin/`

### Port 3000 sudah dipakai

```bash
# Gunakan port lain
PORT=3001 npm run dev
```

## 🔄 Complete Workflow

1. **Start Django Backend**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start MQTT Publisher** (terminal baru)
   ```bash
   python mqtt_complete_publisher.py
   ```

3. **Start Next.js Frontend** (terminal baru)
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open Dashboard**
   ```
   http://localhost:3000
   ```

Data akan flow: MQTT → Django → Next.js → Display

## 📝 Notes

- Frontend polling setiap 2 detik untuk data terbaru
- Semua metric akan update otomatis
- Loading state saat initial fetch
- Error state jika backend offline
- Map menggunakan location dari site info

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.ts` untuk ubah color scheme.

### Add New Metrics

1. Update types di `src/types/index.ts`
2. Update API serializer di Django
3. Update components untuk display metric baru

## 📞 Support

Jika ada masalah, cek:
1. Django backend logs
2. Browser console (F12)
3. Network tab untuk API calls
4. MQTT publisher logs
