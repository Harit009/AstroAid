# **AstroAid**

<p align="center">
  <strong>A High-Fidelity Scientific Space Exploration Platform & Real-Time Space Weather Intelligence Center</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind UI" />
  <img src="https://img.shields.io/badge/NASA_APIs-black?style=for-the-badge&logo=nasa&logoColor=white" alt="NASA Open APIs" />
</p>

---

## 1. Project Overview

**AstroAid** is an advanced, engineering-grade web application engineered to bridge the gap between high-level astrophysical research and intuitive, interactive data visualization. Built on top of a responsive dark-mode layout, AstroAid aggregates official aerospace datasets, telemetry feeds, and solar notifications to deliver a centralized monitoring terminal for astronomers, developers, and space enthusiasts.

This application provides real-time orbital calculations, space weather storm reports, and detailed astronomical archives. It is optimized for sub-second page loads, low GPU overhead, and clean interface scaling.

---

## 2. Platform Architecture

AstroAid is built on a modern frontend stack to support scalable, real-time data pipelines:

*   **Next.js (App Router)**: Leverages React Server Components (RSC) to render deep-dive scientific archives on the server side, shifting page-load weight away from client web browsers.
*   **Custom React Hooks**: Encapsulates dynamic lifecycle tracking, interval polling algorithms, and real-time state hydration for live components (e.g., ISS tracking).
*   **Tailwind UI & Custom CSS Layers**: Uses a structured single-responsibility canvas model to isolate the application background layer, eliminating rendering bottlenecks and duplicate canvas repaints (the "double background" layout bug).
*   **NASA Open API Integration**: Coordinates telemetry data streams from NASA's Space Weather Database of Notifications, Knowledge, and Information (DONKI) API and the Astronomy Picture of the Day (APOD) endpoints.

---

## 3. Production Features

### 📡 Live Mission Control
*   **ISS Tracking Interface**: Plots real-time telemetry coordinates (latitude, longitude, altitude, velocity) using background polling intervals.
*   **Trajectory Visualization**: Renders interactive map coordinates tracing the current orbital path of the International Space Station over a clean vector globe layout.

### 🪐 Phenomenon Archive
*   **Quantitative Data Cards**: High-fidelity scientific profiles detailing critical astronomical features (such as Supermassive Black Holes, Neutron Stars, and Gravitational Waves).
*   **Technical Specifications**: Each card includes quantitative metrics (solar masses, event horizon radius, rotation period) alongside verified academic citations and research links.
*   **Real-time Search Filter**: A client-side search engine with instant indexing to category types (stars, anomalies, theoretical physics).

### ☀️ Space Weather Intelligence Center
*   **Solar Flare Tracking (FLR)**: Displays real-time logs of active solar flares categorized by intensity classification (C, M, and X-class flares).
*   **Geomagnetic Storm Warnings (GST)**: Highlights warning zones, solar wind velocities, Kp index levels, and atmospheric shock frontiers.
*   **Interplanetary Magnetic Field (IMF) Status**: Real-time status logs checking coronal holes, solar magnetograms, and CME trajectories.

---

## 4. How to Setup Locally

Ensure you have [Node.js](https://nodejs.org/) (v18.x or higher) and [npm](https://www.npmjs.com/) installed on your machine.

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/AstroAid.git
cd AstroAid
```

### Step 2: Install Node Dependencies
Install all required project packages using npm:
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env.local` file in the root directory and append your personal NASA API key:
```env
# Get your API key from: https://api.nasa.gov/
NEXT_PUBLIC_NASA_API_KEY="your_nasa_api_key_here"
```

### Step 4: Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the live dashboard.

### Step 5: Build for Production
To test the production compilation and static page generation, run:
```bash
npm run build
npm run start
```

---

## 5. Directory Structure & Files

For an in-depth breakdown of project routing, proxy architecture, and the double background styling fix, please consult the [ARCHITECTURE.md](file:///C:/Users/Harit/.gemini/antigravity/scratch/ARCHITECTURE.md) file. For information on code submission standards, branch rules, and pull request procedures, refer to the [CONTRIBUTING.md](file:///C:/Users/Harit/.gemini/antigravity/scratch/CONTRIBUTING.md) file.

---

<p align="center">
  <strong>AstroAid Repository Documentation</strong> • Developed by <strong>Harit Ghetiya | Diploma in Computer Engineering</strong>
</p>
