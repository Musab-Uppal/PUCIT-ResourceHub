# 🤝 Contributing to PUCIT ResourceHub

First off, **thank you** for taking the time to contribute! 🎉 Every contribution — whether it's fixing a typo, reporting a bug, or building a new feature — helps make this platform better for all PUCIT students.

Please read this guide before making your first contribution.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Your First Code Contribution](#your-first-code-contribution)
- [Development Setup](#development-setup)
- [Branch & Commit Conventions](#branch--commit-conventions)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Code Style & Standards](#code-style--standards)
- [Project Structure Overview](#project-structure-overview)

---

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it. Please report unacceptable behavior to the maintainers.

---

## Getting Started

1. **Fork** the repository by clicking the "Fork" button at the top of the page.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/PUCIT-ResourceHub.git
   cd PUCIT-ResourceHub
   ```
3. **Add the upstream remote** so you can pull in future changes:
   ```bash
   git remote add upstream https://github.com/Musab-Uppal/PUCIT-ResourceHub.git
   ```
4. Follow the [Development Setup](#development-setup) instructions below.

---

## How Can I Contribute?

### Reporting Bugs

Before submitting a bug report, please:
- Check the [existing issues](https://github.com/Musab-Uppal/PUCIT-ResourceHub/issues) to avoid duplicates.
- Try to reproduce the bug on the latest `main` branch.

When you're ready, [open a bug report](https://github.com/Musab-Uppal/PUCIT-ResourceHub/issues/new?template=bug_report.md) and fill in all the required fields.

> **Good bug reports** include: what you expected to happen, what actually happened, and steps to reproduce.

### Suggesting Features

Have an idea? We'd love to hear it! [Open a feature request](https://github.com/Musab-Uppal/PUCIT-ResourceHub/issues/new?template=feature_request.md) and describe:
- The problem your feature solves
- Your proposed solution
- Any alternatives you've considered

### Your First Code Contribution

Not sure where to start? Look for issues tagged:
- `good first issue` — simpler issues, great for newcomers
- `help wanted` — issues where we'd especially appreciate external help
- `bug` — something that is broken and needs fixing

---

## Development Setup

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | v18+ |
| npm | v9+ |
| MongoDB | v6+ (local) or Atlas URI |
| Cloudinary Account | Free tier works fine |

### Backend

```bash
cd backend
npm install

# Copy the example env file and fill in your values
cp .env.example .env
```

Open `.env` and fill in:

```env
MONGO_URI=mongodb://localhost:27017/pucit-resourcehub
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the dev server:
```bash
npm run dev   # starts nodemon on port 5000
```

### Frontend

```bash
cd frontend
npm install

# Copy the example env file and fill in your values
cp .env.example .env
```

Open `.env` and fill in:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:
```bash
npm run dev   # starts Vite on port 5173
```

---

## Branch & Commit Conventions

### Branch Naming

Use the following prefixes when creating branches:

| Prefix | Use case |
|---|---|
| `feat/` | A new feature |
| `fix/` | A bug fix |
| `docs/` | Documentation changes only |
| `style/` | Formatting, missing semicolons, etc. |
| `refactor/` | Code restructuring (no functional change) |
| `chore/` | Build process, dependency updates, etc. |

**Examples:**
```
feat/add-bookmark-feature
fix/upload-validation-error
docs/update-readme-setup
```

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

**Examples:**
```
feat(resources): add filter by semester
fix(auth): resolve cookie expiry on logout
docs: add contributing guide
chore(deps): update mongoose to v9.7
```

---

## Submitting a Pull Request

1. **Sync your fork** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create your branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Make your changes** following our [code style guidelines](#code-style--standards).

4. **Test your changes** manually to make sure nothing is broken.

5. **Push** your branch:
   ```bash
   git push origin feat/your-feature-name
   ```

6. **Open a Pull Request** on GitHub against the `main` branch. Fill in the [PR template](.github/PULL_REQUEST_TEMPLATE.md) completely.

### PR Checklist

Before requesting a review, ensure:
- [ ] Your branch is up to date with `upstream/main`
- [ ] The code works locally without errors
- [ ] You haven't committed any `.env` files or secrets
- [ ] `node_modules/` is not included in your commits
- [ ] Your PR description clearly explains what and why

---

## Code Style & Standards

### General

- Use **2 spaces** for indentation (no tabs).
- Keep lines under **100 characters** where reasonable.
- Remove unused variables and imports before committing.
- Add comments for non-obvious logic.

### Frontend (React / JSX)

- Use **functional components** with hooks — no class components.
- Keep components focused and single-purpose.
- Use **TanStack Query** for all server-state fetching.
- Use **Zustand** for client-side global state.
- Run `npm run lint` before committing and fix all ESLint errors.

### Backend (Node.js / Express)

- Separate concerns: keep logic in `controllers/`, routing in `routes/`, and schemas in `models/`.
- Always validate user input before processing.
- Never expose raw error messages from MongoDB/Mongoose to the client.
- Use `async/await` — no raw `.then()/.catch()` chains.
- Sensitive config (keys, URIs) must **always** come from environment variables.

---

## Project Structure Overview

```
backend/
├── config/        # db.js, cloudinary.js, multer.js
├── controllers/   # Business logic (authController, resourceController)
├── middleware/    # protectRoute, etc.
├── models/        # User.js, Resource.js Mongoose schemas
├── routes/        # authRoutes.js, resourceRoutes.js
└── server.js      # App entry point

frontend/src/
├── api/           # Axios instance & API helper functions
├── components/    # Reusable UI components (Navbar, Card, etc.)
├── pages/         # Page-level components (HomePage, LoginPage, etc.)
└── store/         # Zustand state stores
```

---

## Questions?

Feel free to open a [Discussion](https://github.com/Musab-Uppal/PUCIT-ResourceHub/discussions) or drop a comment on an existing issue. We're happy to help! 🙌
