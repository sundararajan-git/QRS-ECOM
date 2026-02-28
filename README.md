# QRS Ecom - Fullstack E-Commerce Platform

A modern, responsive e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a beautiful UI, secure authentication, and a comprehensive admin dashboard.

## 🚀 Tech Stack

### Frontend

- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI & Radix UI Primitives
- **State/Data Fetching:** Custom Hooks with Axios
- **Routing:** React Router v6
- **Icons:** Lucide React (`react-icons/lu`)
- **Theme:** Dark/Light mode support via Context API

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Validation:** express-validator
- **Security:** Helmet, CORS
- **File Uploads:** Cloudinary & Multer

## ✨ Key Features

### User Experience

- 🛍️ **Modern Storefront:** Clean, responsive design for browsing categories and products.
- 🌓 **Theme Support:** Built-in dark and light mode toggle.
- 🔍 **Live Search:** Instant product filtering and suggestion dropdowns.
- 🛒 **Shopping Cart:** Persistent cart state using Context API.
- 💳 **Checkout Flow:** Simulated payment processing and order confirmation.
- 👤 **User Profiles:** Manage account details, profile pictures, and view order history.

### Admin Dashboard

- 📊 **Centralized Management:** Dedicated `/admin` route protected by role-based auth.
- 📦 **Product Management:** Add, edit, and delete products with rich descriptions, pricing (including discounts), stock tracking, and image uploads.
- 📁 **Category Management:** Dynamic category creation to organize the catalog.
- 📱 **Responsive Sidebar:** Persistent navigation on desktop, slide-out drawer on mobile devices.

### Backend Infrastructure

- 🛡️ **Robust Security:** XSS protection (via `express-validator` escaping), Helmet headers, and strictly configured CORS.
- 📧 **Verification Emails:** Built-in mail handler for user signup flows.
- 🗄️ **Structured Architecture:** Modular design separating Routes, Controllers, Services, and Validators for high maintainability.

## 🛠️ Local Development Setup

### 1. Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Locally or via MongoDB Atlas)

### 2. Clone the Repository

```bash
git clone <repository-url>
cd QRS-ECOM
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with your environment variables (Database URI, JWT Secrets, Cloudinary keys, etc.).

**Sample `backend/.env`:**

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=onboarding@resend.dev
```

```bash
npm run dev
```

_The backend will typically start on `http://localhost:8080`_

### 4. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

**Sample `frontend/.env`:**

```env
VITE_API_URL=http://localhost:8080/api
```

```bash
npm run dev
```

_Vite will start the frontend development server, typically on `http://localhost:5173`_

## 📁 Project Structure

```text
QRS-ECOM/
├── backend/                  # Node.js/Express API
│   ├── config/               # Database and third-party configs
│   ├── middlewares/          # Auth, Error handling, Validation
│   ├── modules/              # Core features (Auth, User, Admin, Product, Order)
│   ├── routes/               # API route definitions
│   ├── utils/                # Helpers, Error classes, Mailers
│   └── server.js             # Express app entry point
│
└── frontend/                 # React frontend
    ├── public/               # Static assets
    ├── src/
    │   ├── components/       # Reusable UI components (Shadcn)
    │   ├── context/          # React Contexts (Theme, Auth, Cart)
    │   ├── hooks/            # Custom hooks
    │   ├── layout/           # Page wrappers (AdminLayout, AuthLayout)
    │   ├── lib/              # Utilities and Axios instance
    │   ├── pages/            # View components (Home, Profile, Admin)
    │   └── main.tsx          # React application entry point
```
