# SYNAPSE

A responsive talent and career architecture platform built with React, Tailwind CSS, and React Router.

## Getting started

```sh
cd frontend
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Features and routes

### Public pages

- `/` — Home / landing page
- `/login` — Login page
- `/signup` — Sign-up page
- `/about` — About SYNAPSE
- `/features` — Platform features

### Student workspace

- `/student` — Student dashboard
- `/student/profile` — Student profile
- `/student/skill-analysis` — Skill analysis dashboard with skill scores, strengths, areas to improve, progress, and recent activity

### Recruiter workspace

- `/recruiter` — Recruiter dashboard
- `/recruiter/post-job` — Post a job
- `/recruiter/talent-search` — Search for talent
- `/recruiter/candidates` — Candidate profiles
- `/recruiter/applications` — Applications
- `/recruiter/analytics` — Recruiter analytics
- `/recruiter/company` — Company profile

### Faculty workspace

- `/faculty` — Faculty dashboard
- `/faculty/opportunities` — Research opportunities
- `/faculty/training` — Industrial training and faculty development programs
- `/faculty/collaborations` — Collaboration requests
- `/faculty/profile` — Faculty profile
- `/faculty/notifications` — Faculty notifications

## Data

Student dashboard, profile, and skill-analysis screens currently use fictional local mock data from the frontend. The student service is structured so these data functions can later be replaced with API calls. No backend or persistent authentication is configured here.

## Frontend structure

```text
frontend/
  src/
    components/   Shared layouts and role-specific navigation
    data/         Local mock data
    pages/        Public, student, recruiter, and faculty pages
    services/     Data access functions
    App.jsx       Application routes
    main.jsx      React entry point
  package.json    Frontend scripts and dependencies
```

## Available checks

Run these from the `frontend/` directory:

```sh
npm run build
npm run lint
```
