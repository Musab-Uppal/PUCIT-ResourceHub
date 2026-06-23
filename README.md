# 🎓 PUCIT ResourceHub

<div align="center">

![PUCIT ResourceHub Banner](https://img.shields.io/badge/PUCIT-ResourceHub-6c63ff?style=for-the-badge&logo=bookstack&logoColor=white)

**A community-driven platform for PUCIT students to share, discover, and access academic resources.**

[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md#submitting-a-pull-request)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-enforced-blueviolet?style=flat-square)](CODE_OF_CONDUCT.md)

[🌟 Features](#-features) · [🚀 Quick Start](#-quick-start) · [🛠️ Tech Stack](#️-tech-stack) · [🤝 Contributing](#-contributing) · [📜 License](#-license)

</div>

---

## 📖 About

PUCIT ResourceHub is an open-source web platform built **by PUCIT students, for PUCIT students**. It provides a centralized hub where students can upload, search, and download past papers, notes, slides, and other academic materials — organized by course, semester, and department.

---

## 🌟 Features

- 📚 **Resource Sharing** — Upload and download past papers, notes, and slides
- 🔐 **Authentication** — Secure JWT-based auth with HTTP-only cookies
- 🔍 **Search & Filter** — Find resources by course, semester, or type
- ☁️ **Cloud Storage** — Files hosted on Cloudinary
- ⚡ **Fast & Responsive** — Built with React + Vite + TailwindCSS

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Cloudinary](https://cloudinary.com/) account (for file storage)

### 1. Clone the repository

```bash
git clone https://github.com/Musab-Uppal/PUCIT-ResourceHub.git
cd PUCIT-ResourceHub
```

### 2. Set up the Backend

```bash
cd backend
npm install
cp .env.example .env   # Fill in your environment variables
npm run dev
```

### 3. Set up the Frontend

```bash
cd frontend
npm install
cp .env.example .env   # Fill in your environment variables
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI Framework |
| [Vite](https://vitejs.dev/) | Build Tool & Dev Server |
| [TailwindCSS v4](https://tailwindcss.com/) | Styling |
| [React Router v7](https://reactrouter.com/) | Client-side Routing |
| [TanStack Query v5](https://tanstack.com/query) | Server State Management |
| [Zustand](https://zustand-demo.pmnd.rs/) | Client State Management |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Axios](https://axios-http.com/) | HTTP Client |

### Backend
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | Runtime |
| [Express v5](https://expressjs.com/) | Web Framework |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Database |
| [Cloudinary](https://cloudinary.com/) | File Storage |
| [JWT](https://jwt.io/) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Authentication |
| [Multer](https://github.com/expressjs/multer) | File Upload Handling |

---

## 📁 Project Structure

```
PUCIT-ResourceHub/
├── backend/
│   ├── config/          # DB connection, Cloudinary, Multer config
│   ├── controllers/     # Route handler logic
│   ├── middleware/      # Auth guards, error handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express route definitions
│   ├── scripts/         # Utility scripts
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── api/         # Axios instances & API calls
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route-level page components
│       └── store/       # Zustand stores
├── .github/
│   ├── ISSUE_TEMPLATE/  # Bug report & feature request templates
│   └── PULL_REQUEST_TEMPLATE.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── README.md
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

Please read our **[Contributing Guide](CONTRIBUTING.md)** to get started, and check our **[Code of Conduct](CODE_OF_CONDUCT.md)** before participating.

**Quick steps:**
1. Fork the repo
2. Create your branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to your branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

Looking for something to work on? Check out [open issues](https://github.com/Musab-Uppal/PUCIT-ResourceHub/issues) tagged with `good first issue` 🏷️

---

## 🐛 Reporting Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/Musab-Uppal/PUCIT-ResourceHub/issues/new/choose) using one of our templates.

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 🙏 Acknowledgements

Built with ❤️ by the PUCIT student community. Special thanks to all [contributors](https://github.com/Musab-Uppal/PUCIT-ResourceHub/graphs/contributors).

---

<div align="center">
  <sub>⭐ Star this repo if you find it helpful!</sub>
</div>
