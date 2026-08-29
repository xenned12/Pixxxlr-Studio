# PIXXXLR CREATIVES

A modern, full-stack web application and management platform for **PIXXXLR Studio** — a professional photography studio specializing in portrait, corporate, graduation, barkada, and on-site studio photography.

---

## 📸 Overview & Features

- **Client Portal**:
  - **Online Booking System**: Interactive reservation interface with customizable photoshoot packages, date & time slot selection, add-ons, and instant booking summary.
  - **Portfolio & Gallery**: Showcase of high-resolution categorized photography work (portrait, creative shots, outdoor studio, barkada, events).
  - **Pricing & Packages**: Transparent package breakdowns with included services, print inclusions, and optional add-ons.
  - **Live Inquiries & Chat**: Real-time customer chat and inquiry channel.
  - **Location & Studio Info**: Studio details, interactive map, operating hours, and contact channels.

- **Admin Management Portal**:
  - **Secure OTP Authentication**: Passcode generation and verification via direct SMTP email delivery.
  - **Dashboard & Analytics**: Recharts-powered booking metrics, monthly revenue trends, and session analytics.
  - **Bookings Management**: Real-time Firestore synchronization to confirm, reschedule, or cancel bookings.
  - **Automated Email Notifications**: Automatic client confirmations, status updates, and reminders via SMTP (Nodemailer).
  - **Calendar View**: Visual schedule overview for daily and monthly photoshoot sessions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Visualizations**: [Recharts](https://recharts.org/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Date Utilities**: [date-fns](https://date-fns.org/)

### Backend & Services
- **Server**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database & Auth**: [Firebase Firestore](https://firebase.google.com/docs/firestore) & [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- **Email Delivery**: [Nodemailer](https://nodemailer.com/) (Custom SMTP server support)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Asset Processing**: [Sharp](https://sharp.pixelplumbing.com/) for image optimization

### Build Tools
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/) + [tsx](https://github.com/privatenumber/tsx)
- **Production Bundler**: [esbuild](https://esbuild.github.io/)

---

## 🚀 Getting Started / Installation

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js**: `v20.x` or later
- **npm**: `v9.x` or later

### 2. Clone the Repository
```bash
git clone <repository-url>
cd pixxxlr-creatives
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):

```env
# Server Configuration
PORT=3000

# SMTP Configuration for Booking Emails & Admin OTP
SMTP_HOST=mail.pixxxlr.com
SMTP_PORT=465
SMTP_USER=support@pixxxlr.com
SMTP_PASS=your_smtp_password
SMTP_FROM=support@pixxxlr.com

# Firebase / Gemini API (Optional / Auto-configured in cloud deployment)
GEMINI_API_KEY=your_gemini_api_key
```

### 5. Run the Application

#### Development Mode:
Starts the Express backend with Vite middleware and live reloading on port `3000`:
```bash
npm run dev
```

#### Production Build & Run:
Builds the client SPA with Vite and bundles the Node server using esbuild:
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```text
├── public/                 # Static assets, portfolio images, and icons
├── src/
│   ├── components/         # React components
│   │   ├── admin/          # Admin dashboard, calendar, bookings list, chat
│   │   ├── ui/             # Reusable UI primitives
│   │   ├── Booking.tsx     # Photoshoot booking flow
│   │   ├── Portfolio.tsx   # Gallery showcase
│   │   └── ...
│   ├── lib/                # Firebase config, client utilities
│   ├── App.tsx             # Main application router and state
│   └── main.tsx            # React application entry point
├── server.ts               # Express backend API & Vite server integration
├── vite.config.ts          # Vite configuration
└── package.json            # Scripts & dependencies
```

---

## 📄 License
Private project for PIXXXLR Studio. All rights reserved.
