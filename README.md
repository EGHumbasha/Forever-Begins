# Forever Begins — Lobola & Wedding Planner

A two-person shared planner for a Zimbabwean lobola (roora) and wedding,
built for exactly one couple: an admin (owner) and one approved partner.

## Final architecture

```
┌─────────────┐        ┌──────────────────────────────┐
│  Any static  │        │        Firebase (free)        │
│   host:      │  HTTPS │  ┌─────────┐  ┌────────────┐ │
│  GitHub Pages│ ─────► │  │  Auth    │  │ Firestore  │ │
│  or Vercel   │        │  │ email/pw │  │ real-time  │ │
│  or Netlify  │        │  └─────────┘  └────────────┘ │
└─────────────┘        └──────────────────────────────┘
   React + Vite SPA (HashRouter, base './' — runs on any host)
```

- **Frontend**: React 19 + Vite, HashRouter, code-split pages, PWA service
  worker (JS is NetworkFirst so deploys can never be broken by stale cache).
- **Backend**: Firebase Auth (email/password, in-memory sessions — every
  refresh returns to the login screen) + Firestore (one shared planner
  document, live-synced to both people with onSnapshot).
- **Data**: the couple's real plan is baked into `src/data/defaultData.js`
  and written to Firestore when the admin creates the planner.

## Access model

| Collection       | Purpose                                   | Who writes            |
|------------------|-------------------------------------------|-----------------------|
| `admins/{uid}`   | The owner + their planner ID              | Owner only            |
| `users/{uid}`    | Basic profile                             | Each user, own doc    |
| `accessRequests/{uid}` | Partner's join request + status     | Created by partner (pending only); status changed by admin only |
| `planners/{id}`  | The entire shared plan (one document)     | Admin or approved partner |

Flow: **register → (first user becomes admin, creates planner) / (partner
enters Planner ID → pending → admin approves from Admin Panel → in)**.
The admin sees a live red badge when a request is pending. A partner can
never self-approve — rules only let the admin change a request's status.

## One-time Firebase setup

1. console.firebase.google.com → project **forever-begins-e50d9**
2. Build → **Authentication** → Sign-in method → enable **Email/Password**
3. Build → **Firestore Database** → create (production mode)
4. Firestore → **Rules** → paste the contents of `firestore.rules` → **Publish**
5. `src/firebase.js` already contains the project config

Resetting everything: delete all users in Authentication AND all Firestore
collections, then register again (first registrant becomes admin).

## Deploy — option A: GitHub Pages (current)

```bash
npm install
npm run deploy        # builds + pushes dist/ to the gh-pages branch
```
Repo Settings → Pages → branch `gh-pages`, folder `/ (root)`.
URL: https://eghumasha.github.io/Forever-Begins/

## Deploy — option B: Vercel (recommended if github.io is blocked on your network)

1. vercel.com → sign up free with your GitHub account
2. **Add New → Project** → import the `Forever-Begins` repo
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`,
   output `dist`. → **Deploy**
4. You get a URL like `https://forever-begins.vercel.app` — a different
   domain that ISPs blocking github.io will typically not block.

The build is host-agnostic (`base: './'` + HashRouter): the exact same
files work on both hosts, no config changes needed.

## Run locally

```bash
npm install
npm run dev           # http://localhost:5173
```

## Notes

- Refresh = logout by design (in-memory auth persistence).
- The partner's waiting screen checks approval live via a button — no reload.
- Reports (PDF) lazy-load ~800KB of libraries only when used.
- Optional hardening once set up: in `firestore.rules`, change the `admins`
  create/update line to `allow create, update: if false;` so no new admin
  can ever be added.
