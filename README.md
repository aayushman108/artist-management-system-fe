# Artist Management System

Frontend for managing artists with features for handling artist profiles, CSV imports, and related administrative workflows. Built with React, TypeScript, and Vite.

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 8
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Form Validation:** Zod
- **CSS:** Sass
- **Icons:** React Icons
- **CSV:** Papaparse

## Features

- **Authentication:** Signup/registration with email verification, login, forgot password flow, and logout.
- **Role-Based Access Control:** Three roles — `super_admin`, `artist_manager`, and `artist` — with granular permissions across the dashboard.
- **Invitations:** Guest users can request an invitation. Super admins review requests and send invite links via email. Super admins can also directly invite users with any role; artist managers can invite with the `artist` role only.
- **Users Page:** Super admin only. View, update, and soft-delete users (super admins and artist managers). Hard or soft delete artists.
- **Artists Page:** Super admins see all artists; artist managers see only their assigned artists. Supports CSV import/export. Artists cannot be created via form — they must be invited.
- **User Statuses:** `active`, `inactive`, and `migrated` (imported users must use forgot password flow to log in).
- **Musics & Albums:** CRUD operations for super admins and artists. The Musics tab in the sidebar is visible only to artists.
- **Profile:** All users can view and update their own profile.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs the app at `http://localhost:5173`.

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```
