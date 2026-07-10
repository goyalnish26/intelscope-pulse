# 📡 IntelScope-Pulse

> **Real-time Threat Intelligence Dashboard** — Live CVEs from NIST NVD database, interactive charts, and curated cybersecurity news, all in one clean and fast dashboard. Built with React 19, TanStack Start, and Tailwind CSS.

---

## 🌟 Key Features

* **📡 Live CVE Feed:** Dynamically pulls the latest vulnerability disclosures directly from the **NIST NVD API 2.0**, displaying them with CVSS score, severity level, affected vendor, and deep links to full advisories.
* **📊 Attack & Threat Trends:** Visualizes security disclosures using interactive **Recharts** visualizations:
  * *Severity Distribution:* Pie chart showing critical, high, medium, and low severity CVE counts.
  * *Publication Trend:* Area chart tracing new CVE publications over 7, 30, or 90 days.
  * *Top Vendors Heatmap:* Bar chart displaying the most frequently targeted vendors.
* **📰 Curated News Feed:** Parallel-fetches and aggregates cybersecurity RSS feeds from five trusted publishers: *The Hacker News, SecurityWeek, BleepingComputer, Dark Reading, and Krebs on Security*.
* **🔖 Personal Watchlist:** Bookmark critical vulnerabilities to track them. The watchlist resides locally in the user's browser (no authentication required).

---

## 🛠️ Tech Stack

* **Core & Routing:** [React 19](https://react.dev/), [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (Server-side rendering and functions), [TanStack Router](https://tanstack.com/router/v1) (Type-safe routing).
* **Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest) for declarative caching and synchronization.
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) for fully responsive, theme-tailored layouts.
* **Visualizations:** [Recharts](https://recharts.org/) for beautiful, interactive dashboards.
* **Database / Backend:** [Supabase](https://supabase.com/) for managing subscribers and notifications.
* **Deployment:** Pre-configured for deployment to **GitHub Pages** using `gh-pages`.

---

## ⚙️ How It Works under the Hood

1. **Fetch:** The server-side functions query the **NVD 2.0 REST API** for vulnerabilities published within a dynamic 90-day window, grabbing the latest 100 items by tracking `totalResults`.
2. **Normalize:** Raw NVD JSON payloads are parsed to extract CPE vendors and resolve severity levels from the highest available CVSS metric (`v3.1` → `v3.0` → `v2`).
3. **Cache:** Results are cached in-memory server-side for **10 minutes** to enforce polite API request frequency and ensure the dashboard remains incredibly fast.
4. **Render:** The client app renders reactive panels with instant filters for date ranges (7D, 30D, 90D) and severity thresholds.

---

## 🚀 Getting Started

### 📋 Prerequisites

* **Node.js** (v18 or higher)
* **npm** (v10 or higher)

### 💻 Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/goyalnish26/IntelScope-Pulse.git
   cd IntelScope-Pulse
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
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
   Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📦 Deployment to GitHub Pages

The repository is configured for deployment to a custom subdomain (`intelscope.rootnishchal.codes`). 

1. To compile and publish the static bundle to the `gh-pages` branch, execute:
   ```bash
   npm run deploy
   ```
2. The `public/CNAME` file automatically handles custom domain routing on GitHub.

---

## 📝 License

This project is open-source and free to use. Refer to the `LICENSE` file (if present) or contact the author for options. Developed by [@goyalnish26](https://github.com/goyalnish26).
