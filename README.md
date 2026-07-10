# 📡 IntelScope-Pulse

> **Frictionless, High-Fidelity Threat Intelligence Dashboard** — Real-time vulnerability aggregation from the NIST NVD database, interactive CVSS charts, and curated cybersecurity news, all in one clean and fast dashboard.

---

## 🔍 What is IntelScope-Pulse?

**IntelScope-Pulse** is an open-source threat intelligence dashboard built for cybersecurity professionals, systems administrators, students, and technology teams. 

Modern threat monitoring is often fragmented, expensive, or buried under enterprise sales friction. IntelScope-Pulse resolves this by aggregating, normalizing, and visualising live vulnerability and security disclosure feeds into a single, high-fidelity view—completely free and without any registration or tracking.

### 💡 Why is it useful?

* **Eliminate Noise:** Focus on the latest vulnerability disclosures in a curated 90-day window, mapped and updated in real-time.
* **Instant Data Legibility:** Make sense of raw CVE databases at a glance using intuitive severity distributions, publication trend lines, and targeted vendor hotmaps.
* **Consolidated Intelligence:** Monitor both raw vulnerabilities and curated cybersecurity stories side-by-side, saving you from switching between multiple feeds and tabs.
* **Privacy by Design:** Create and manage a personal watchlist to track specific CVEs. All watchlists are stored entirely in your local browser storage—**no database sign-up, email list, or tracking queries required**.

---

## ✨ Core Features

* **📡 Live CVE Feed:** Dynamically pulls the latest vulnerability disclosures directly from the **NIST NVD API 2.0**, displaying them with CVSS score, severity level, affected vendor, and deep links to full advisories.
* **📊 Attack & Threat Trends:** Visualizes security disclosures using interactive **Recharts** visualizations:
  * *Severity Distribution:* Pie chart showing critical, high, medium, and low severity CVE counts.
  * *Publication Trend:* Area chart tracing new CVE publications over 7, 30, or 90 days.
  * *Top Vendors Heatmap:* Bar chart displaying the most frequently targeted vendors.
* **📰 Curated News Feed:** Parallel-fetches and aggregates cybersecurity RSS feeds from five trusted publishers: *The Hacker News, SecurityWeek, BleepingComputer, Dark Reading, and Krebs on Security*.
* **🔖 Personal Watchlist:** Bookmark critical vulnerabilities to track them. The watchlist resides locally in the user's browser (no authentication required).

---

## ⚙️ How It Works under the Hood

1. **Querying NVD API 2.0:** The server-side functions query the **NVD 2.0 REST API** for vulnerabilities published within a dynamic 90-day window. To ensure optimal performance and avoid API rate limits, it pulls the latest 100 items by calculating `startIndex = Math.max(0, totalResults - 100)`.
2. **Payload Normalization:** Raw NVD JSON payloads are parsed to extract CPE vendors and resolve severity levels from the highest available CVSS metric (`v3.1` → `v3.0` → `v2`).
3. **Server-Side Cache:** Results are cached in-memory server-side for **10 minutes** to enforce polite API request frequency and ensure the dashboard remains incredibly fast.
4. **Reactive Render:** The client app renders reactive panels with instant filters for date ranges (7D, 30D, 90D) and severity thresholds.

---

## 🛠️ Tech Stack & Architecture

* **Core & Routing:** [React 19](https://react.dev/), [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (Server-side rendering and functions), [TanStack Router](https://tanstack.com/router/v1) (Type-safe routing).
* **Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest) for declarative caching and synchronization.
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) for fully responsive, theme-tailored layouts.
* **Visualizations:** [Recharts](https://recharts.org/) for beautiful, interactive dashboards.
* **Database / Backend:** [Supabase](https://supabase.com/) for managing subscribers and notifications.
* **Serverless Runtime:** Powered by [Nitro](https://nitro.build/), compiled for production deployments.

---

## 🚀 Getting Started

### 📋 Prerequisites

* **Node.js** (v18 or higher)
* **npm** (v10 or higher)

### 💻 Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/goyalnish26/intelscope-pulse.git
   cd intelscope-pulse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file at the root of the project with your Supabase details (or rename `.env.example` if available):
   ```env
   SUPABASE_PROJECT_ID="your-supabase-project-id"
   SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
   SUPABASE_URL="https://your-supabase-project.supabase.co"
   VITE_SUPABASE_PROJECT_ID="your-supabase-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
   VITE_SUPABASE_URL="https://your-supabase-project.supabase.co"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment to Vercel

IntelScope-Pulse is optimized for deployment to Vercel using the built-in Nitro preset.

1. **Deploy from GitHub:**
   * Import the repository to Vercel.
   * Vercel will automatically detect the **Nitro** server setup.
   * Keep the default build configuration and deploy.
2. **Build output:** The project compiles local bundles into `.output/` which Vercel serves server-side natively using serverless functions.
