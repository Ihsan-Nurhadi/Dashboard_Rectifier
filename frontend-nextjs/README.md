# Rectifier Monitoring Dashboard

An IoT power system dashboard built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **Real-time Monitoring**: Live updates of rectifier metrics (Voltage, Current, Power).
- **Device Status**: Visual indicators for alarms, warnings, and normal states.
- **Environment Monitoring**: Temperature, humidity, and door status.
- **Battery Health**: Detailed battery bank status and SoC gauge.
- **Responsive Design**: Optimized for desktop and mobile viewing.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Hooks (simulated real-time data)

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open the dashboard**:
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/components/dashboard`: Dashboard widgets (SiteInfo, RectifierStatus, etc.)
- `src/components/ui`: Reusable UI components (Card, Badge, MetricItem)
- `src/hooks`: Custom hooks (useDashboardData for data simulation)
- `src/types`: TypeScript definitions
