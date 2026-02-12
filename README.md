# PINTU Frontend - Portal Informasi Terpadu

**PINTU** (Portal Informasi Terpadu) adalah sistem manajemen informasi terintegrasi untuk SDN Sukapura 01 Jakarta Utara. Aplikasi frontend ini menyediakan interface modern dan responsif untuk pengelolaan data sekolah dengan autentikasi yang aman menggunakan JWT.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Features](#features)
- [Best Practices](#best-practices)
- [Project Architecture](#project-architecture)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## 🎯 Overview

PINTU adalah solusi terintegrasi untuk manajemen informasi sekolah yang dirancang dengan:
- **User Authentication** - Sistem login aman dengan JWT token
- **Persistent Login** - Token dan user data tersimpan di localStorage
- **Protected Routes** - Route protection berbasis autentikasi
- **Responsive Design** - Mobile-first approach dengan Tailwind CSS
- **Modern UI/UX** - Animasi smooth dan toast notifications
- **Error Handling** - Error message yang informatif dari API

## 🛠️ Tech Stack

### Frontend Framework
- **Nuxt 4.3.1** - Meta framework Vue 3
- **Vue 3.5.28** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript

### Styling & Design
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Tailwind Vite** - Vite plugin untuk Tailwind CSS
- **Poppins Font** - Google Font untuk typography

### State Management
- **Pinia 2.1.7** - Vue store library
- **@pinia/nuxt** - Nuxt integration untuk Pinia

### Development Tools
- **Vite 7.3.1** - Build tool
- **Nitro 2.13.1** - Server engine untuk Nuxt

### Routing
- **Vue Router 4.6.4** - Official router untuk Vue 3

## 📁 Project Structure

```
pintu-frontend/
├── app/                           # Main application folder
│   ├── assets/                    # Static files (CSS, images, fonts)
│   │   ├── css/                   # Global stylesheets
│   │   └── images/                # Static images
│   ├── components/                # Reusable Vue components
│   │   └── common/                # Common UI components (Button, Input, Alert)
│   ├── composables/               # Vue composables (reusable logic)
│   ├── layouts/                   # Layout templates untuk pages
│   ├── middleware/                # Route middleware & guards
│   ├── pages/                     # File-based routing (auto-generated routes)
│   │   └── backoffice/            # Auth-protected routes
│   ├── plugins/                   # Nuxt plugins (initialization scripts)
│   ├── services/                  # API integration & HTTP calls
│   ├── stores/                    # Pinia state management stores
│   ├── types/                     # TypeScript interfaces & types
│   ├── utils/                     # Utility functions & helpers
│   └── app.vue                    # Root component
│
├── public/                        # Static public assets (robots.txt, favicon, etc)
├── .nuxt/                         # Build output (auto-generated)
├── node_modules/                  # Dependencies (auto-generated)
├── nuxt.config.ts                 # Nuxt configuration
├── package.json                   # Project dependencies & scripts
├── tsconfig.json                  # TypeScript configuration
├── .env.example                   # Environment variables template
├── .env.local                     # Local environment variables (git-ignored)
├── .gitignore                     # Git ignore rules
└── README.md                       # Project documentation
```

### Penjelasan Folder Structure

| Folder | Fungsi |
|--------|--------|
| **app/assets/** | Menyimpan file statis seperti CSS global, image, font |
| **app/components/** | Komponen Vue reusable yang digunakan di multiple pages |
| **app/composables/** | Logic reusable dalam bentuk functions (seperti useAuth) |
| **app/layouts/** | Template layout untuk pages (login layout, dashboard layout) |
| **app/middleware/** | Route guards untuk proteksi dan validasi sebelum navigate |
| **app/pages/** | File-based routing - setiap file auto-jadi route |
| **app/plugins/** | Scripts yang dijalankan saat app initialization (auth, router setup) |
| **app/services/** | API integration - handle HTTP calls ke backend |
| **app/stores/** | Pinia stores untuk centralized state management |
| **app/types/** | TypeScript interfaces untuk type safety |
| **app/utils/** | Utility functions & helper methods |
| **public/** | Static assets yang tidak perlu processing |
| **.nuxt/** | Build output dari Nuxt (auto-generated, jangan edit) |
| **node_modules/** | Installed dependencies (auto-generated, jangan edit) |

## 🚀 Installation

### Prerequisites
- Node.js 16.x atau lebih tinggi
- npm atau yarn package manager

### Step 1: Clone Repository

```bash
git clone https://github.com/SDN-Sukapura-01-Jakarta-Utara/pintu-frontend.git
cd pintu-frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment Variables

Copy `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Kemudian edit `.env.local` dan sesuaikan URL backend:

```env
NUXT_PUBLIC_API_BASE=http://localhost:3000
```

Jika backend berjalan di port berbeda, ganti `3000` dengan port yang sesuai.

## 🏃 Running the Application

### Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173` (atau port alternative jika 5173 sudah digunakan)

### Production Build

```bash
npm run build
```

Build output akan tersimpan di `.nuxt/dist/`

### Preview Production Build

```bash
npm run preview
```

### Generate Static Site

```bash
npm run generate
```

## ✨ Features

### Authentication
- ✅ Login dengan username dan password
- ✅ JWT token-based authentication
- ✅ Persistent login (localStorage)
- ✅ Logout dengan token invalidation
- ✅ Auto-redirect based on auth status

### User Interface
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Animated login form dengan blob background
- ✅ Toast notifications untuk feedback
- ✅ Loading states pada form submission
- ✅ Password visibility toggle

### Security
- ✅ Protected routes
- ✅ Route guards dengan router middleware
- ✅ Secure token storage
- ✅ CORS handling

### Developer Experience
- ✅ TypeScript untuk type safety
- ✅ Structured project organization
- ✅ Reusable components
- ✅ Composables untuk logic reuse
- ✅ Pinia for state management

## 🎓 Best Practices

### Component Development
- **Single Responsibility** - Setiap component memiliki satu tanggung jawab utama
- **Props & Emits** - Gunakan props untuk data input dan emits untuk events
- **Scoped Styles** - Selalu gunakan `scoped` pada `<style>` tag
- **Named Slots** - Gunakan named slots untuk flexibility

### State Management
- **Use Pinia Store** - Selalu gunakan store untuk shared state
- **Composables** - Gunakan composables untuk reusable logic
- **Keep Components Clean** - Minimize component logic, maksimalkan store/composables

### API Integration
- **Error Handling** - Selalu handle API errors dengan try-catch
- **Loading States** - Show loading indicator saat API call
- **Type Safety** - Gunakan TypeScript interfaces untuk response types

### Styling
- **Tailwind Classes** - Gunakan Tailwind utility classes
- **Responsive Design** - Mobile-first approach dengan breakpoints
- **Dark Mode** - Consider dark mode compatibility
- **Consistency** - Gunakan color palette yang konsisten

### File Organization
- **Feature-Based** - Group related files by feature
- **Clear Naming** - Gunakan nama file yang deskriptif
- **Imports Order** - Group imports (Vue → 3rd party → local)

### Performance
- **Lazy Loading** - Lazy load routes dan components
- **Image Optimization** - Optimize images sebelum upload
- **Bundle Analysis** - Monitor bundle size

### Code Quality
- **TypeScript** - Gunakan TypeScript strict mode
- **Linting** - Follow code style guidelines
- **Comments** - Dokumentasi untuk complex logic
- **Testing** - Unit test untuk critical functions

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────┐
│          Vue Components (UI Layer)          │
│  (LoginForm, Button, Input, Alert, Pages)  │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│      Composables & Stores (Logic Layer)     │
│   (useAuth, AuthStore, useForm)             │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│       Services (API Integration)            │
│        (auth.ts - API calls)                │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│    Backend API (Golang - port 3000)         │
│  /api/v1/auth/login                         │
│  /api/v1/auth/logout                        │
└─────────────────────────────────────────────┘
```

## 🔄 Authentication Flow

```
1. User Input → LoginForm Component
   ↓
2. Form Submit → performLogin() from useAuth
   ↓
3. Store Action → authStore.handleLogin()
   ↓
4. API Call → login() from services/auth.ts
   ↓
5. Backend Response → /api/v1/auth/login
   ↓
6. Store Save → Token + User to localStorage
   ↓
7. Router Navigate → Redirect to /backoffice
   ↓
8. Show Toast → Success notification
```

## 📝 Environment Variables

```env
# Backend API Configuration
NUXT_PUBLIC_API_BASE=http://localhost:3000

# Example untuk production:
NUXT_PUBLIC_API_BASE=https://api.pintu-sekolah.id
```

## 🔐 Security Notes

- ⚠️ JWT token disimpan di localStorage (accessible by JS)
- ⚠️ Untuk production, pertimbangkan httpOnly cookies
- ⚠️ Selalu gunakan HTTPS di production
- ⚠️ Backend harus validate token di setiap request
- ⚠️ Implement CORS properly di backend

## 🐛 Troubleshooting

### CORS Error
- Pastikan backend allow cross-origin requests
- Check `NUXT_PUBLIC_API_BASE` URL di `.env.local`
- Verify backend CORS middleware configuration

### Token Expired
- Token otomatis dihapus dari localStorage
- User akan redirect ke login page
- Re-login untuk mendapatkan token baru

### Module Not Found
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Gunakan port custom
npm run dev -- --port 3002
```

## 📚 Useful Resources

- [Nuxt Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 📄 License

Copyright © 2026 SDN Sukapura 01. All rights reserved.

This project is proprietary software of SDN Sukapura 01 Jakarta Utara. Unauthorized copying, modification, or distribution is prohibited without explicit permission.

## 👥 Contributors

### Development Team
- **Lead Developer** - Sistem dan Frontend Development

## 🆘 Support

Untuk issues, questions, atau support, silakan hubungi:

### Contact Information

**WhatsApp**
- 📱 +62 (888) 9125-991

**Developer Email**
- 📧 sdnsukapura01.dev@gmail.com

**School Email**
- 📧 sdnsukapuraa01@gmail.com

**Personal Email**
- 📧 syahiraisnaeni15@gmail.com

### Support Channels

- 📝 GitHub Issues untuk bug reports
- 💬 WhatsApp untuk urgent issues
- 📧 Email untuk formal inquiries

---

**Last Updated:** February 2026

**Version:** 1.0.0

Made with ❤️ for SDN Sukapura 01 Jakarta Utara
