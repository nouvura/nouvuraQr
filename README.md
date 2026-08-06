# NOUVURA QR

Dynamic portfolio pages and QR codes, generated from a single form. Built with
Next.js 14 (App Router), Tailwind CSS, Framer Motion, and Firebase
(Firestore + Storage) as the live backend — no mock data anywhere in the flow.

---

## 1. Folder structure

```
nouvura-qr/
├── app/
│   ├── layout.js              Root layout, fonts, metadata
│   ├── page.js                Landing page (hero + CTA)
│   ├── globals.css            Design tokens, grain overlay, base styles
│   ├── create/
│   │   └── page.js            The intake form + post-submit QR reveal
│   └── p/[id]/
│       └── page.js            Public portfolio page (reads Firestore by id)
├── components/
│   ├── LinkInput.jsx           Dynamic link list w/ platform auto-detect
│   ├── ImageUploader.jsx       Logo + gallery uploaders (LogoUploader, GalleryUploader)
│   ├── PlatformIcon.jsx        Icon mapping per platform
│   ├── StarRating.jsx          1–5 star input
│   ├── QRCodeDisplay.jsx       Renders + downloads QR as PNG/SVG
│   └── QRMatrixHero.jsx        Landing page signature animation
├── lib/
│   ├── firebase.js             Firebase app/Firestore/Storage/Analytics init
│   ├── portfolioService.js     All Firestore + Storage read/write logic
│   └── platformDetect.js       URL → platform label detection
├── public/
│   └── grain.svg                Film-grain texture
├── firestore.rules             Firestore security rules
├── storage.rules               Storage security rules
├── firebase.json / firestore.indexes.json   Firebase CLI config
├── .env.local                  Firebase web config (see below)
├── tailwind.config.js
└── package.json
```

---

## 2. Firebase setup (step by step)

The app is already wired to the project you gave me (`nouvura`), via
`.env.local`. To make it fully live, you still need to **turn on** the two
products it depends on inside the Firebase console:

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → project **nouvura**.
2. **Firestore Database** → Create database → start in *production mode* → pick a region close to your users (e.g. `eur3` for Europe/Algeria).
3. **Storage** → Get started → production mode → same region as Firestore.
4. **Deploy the security rules** included in this repo so reads/writes actually work:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use nouvura
   firebase deploy --only firestore:rules,storage:rules
   ```
   (This pushes `firestore.rules` and `storage.rules` — see section 5 for what they allow.)
5. In **Project settings → General → Your apps**, confirm the web app config matches `.env.local`. It already does, since I used exactly what you provided:

   ```
   apiKey: AIzaSyDQoZxLaAqLb6EG_Ossvp_gRQx3FiEYDjo
   authDomain: nouvura.firebaseapp.com
   projectId: nouvura
   storageBucket: nouvura.firebasestorage.app
   messagingSenderId: 792152124967
   appId: 1:792152124967:web:1d1d3aa4950a0f34cda802
   measurementId: G-C9EGVHFRKG
   ```

   This config is safe to expose client-side (it identifies the project, it
   isn't a secret) — that's why it's fine to ship it in `.env.local` /
   `NEXT_PUBLIC_*` variables bundled into the browser build.

6. **Analytics**: already initialized in `lib/firebase.js`, guarded so it
   only loads in the browser and only if the SDK detects support (Analytics
   doesn't run during server-side rendering).

---

## 3. Run it locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The `.env.local` file is already populated, so
Firestore/Storage calls work immediately once you've completed step 2 above.

---

## 4. Firestore schema

**Collection: `portfolios/{id}`**

| Field              | Type      | Notes                                            |
|--------------------|-----------|---------------------------------------------------|
| `id`               | string    | short UUID fragment, also the doc id and URL slug |
| `category`         | string    | `Business` \| `Creative` \| `Personal`             |
| `title`            | string    | required                                           |
| `description`      | string    |                                                     |
| `phone`            | string    | required, primary contact                          |
| `additionalPhones` | string[]  | optional extra numbers                             |
| `links`            | array     | `{ url, platform }` — platform auto-detected if blank |
| `logoUrl`          | string\|null | Storage download URL                            |
| `images`           | string[]  | Storage download URLs, gallery order preserved     |
| `ratingSum`         | number    | running total of all star values                  |
| `ratingCount`       | number    | number of ratings submitted                        |
| `ratingAverage`     | number    | `ratingSum / ratingCount`, recomputed transactionally |
| `createdAt`         | timestamp | server timestamp                                    |

**Subcollection: `portfolios/{id}/ratings/{ratingId}`**

| Field       | Type      | Notes            |
|-------------|-----------|------------------|
| `value`     | number    | integer 1–5      |
| `createdAt` | timestamp | server timestamp |

Individual ratings are kept (not just the aggregate) so you can audit
distribution or add moderation later without losing history.

---

## 5. Storage layout & rules

```
portfolios/{portfolioId}/logo/{filename}
portfolios/{portfolioId}/gallery/{filename}
```

`storage.rules` allows public reads (needed so portfolio pages and QR
scanners can load images), and restricts writes to:
- the `logo` or `gallery` subfolders only,
- image content types only,
- files under 8MB.

`firestore.rules` allows:
- public reads of any portfolio (that's the point of the QR code),
- creating a new portfolio document (open, since there's no auth in this MVP),
- updates *only* to the three rating fields — nothing else about a portfolio
  can be silently rewritten after creation,
- appending to the `ratings` subcollection with a validated 1–5 integer, and
  nothing else (no edits, no deletes).

If you later add authentication for portfolio owners (to allow edits/deletes),
tighten `allow create`/`allow update` to check `request.auth.uid` against an
`ownerId` field you'd add to the schema.

---

## 6. Core flow

1. **Landing (`/`)** — hero + "Create QR Portfolio" CTA.
2. **Form (`/create`)** — collects category, title, description, logo,
   gallery images, phone (+ extra numbers), and links. Platform names are
   auto-detected from the URL (Instagram, Facebook, TikTok, LinkedIn,
   YouTube, Twitter, WhatsApp, Telegram, Behance, Dribbble, GitHub,
   Pinterest, Snapchat, or generic "Website") if you leave the platform
   field blank.
3. **On submit** (`lib/portfolioService.js → createPortfolio`):
   - uploads the logo and gallery images to Storage,
   - writes one Firestore document with all the collected data,
   - returns a short id used to build `/p/{id}`.
4. **QR reveal** — `components/QRCodeDisplay.jsx` renders the QR (via the
   `qrcode` package) to a `<canvas>` for PNG export and generates an SVG
   string for vector export. Both downloads happen fully client-side.
5. **Portfolio page (`/p/{id}`)** — fetches the document live from
   Firestore, renders hero (logo/initial + title), description, a clickable
   `tel:` link for each phone number, link buttons with per-platform icons,
   an image gallery grid, and a star-rating widget. The category value
   (`Business` / `Creative` / `Personal`) shifts the accent color and hero
   label — Business leans gold, Creative leans deep red, Personal is neutral
   bone — without changing the underlying layout.
6. **Rating** — `submitRating(id, value)` writes to the `ratings`
   subcollection and updates `ratingSum`/`ratingCount`/`ratingAverage` on the
   parent document inside a Firestore transaction, so concurrent ratings
   can't clobber each other. The page immediately re-fetches to show the new
   average and count.

---

## 7. Deployment (Vercel)

1. Push this repo to GitHub.
2. In Vercel: **New Project** → import the repo.
3. Add the environment variables from `.env.local` under **Settings →
   Environment Variables** (all seven `NEXT_PUBLIC_FIREBASE_*` keys) for
   Production, Preview, and Development.
4. Deploy. Vercel auto-detects Next.js — no build command changes needed.
5. Back in the Firebase console, go to **Authentication → Settings →
   Authorized domains** and add your Vercel domain (e.g.
   `nouvura-qr.vercel.app`) — this isn't required for Firestore/Storage
   reads/writes, but is good practice if you add Firebase Auth later.
6. Firestore/Storage security rules are deployed separately via the Firebase
   CLI (`firebase deploy --only firestore:rules,storage:rules`), not through
   Vercel — do this once from step 2 above and again anytime you edit
   `firestore.rules` / `storage.rules`.

---

## 8. Notes on what's real vs. what you still choose

- Every read/write in this app hits live Firestore/Storage — there is no
  mock or local-only data path.
- The Firebase web config you provided is already wired into `.env.local`.
  The one thing only you can do is flip Firestore and Storage from "not
  created" to "created" in the console (step 2), since that requires
  account-level access I don't have.
- This MVP has no authentication, matching the brief (no login step in the
  UX flow). Anyone with a portfolio's id can view or rate it, matching a
  public QR-code use case. If you want owners to be able to edit or delete
  their own portfolio later, add Firebase Auth and an `ownerId` field, then
  tighten `firestore.rules` accordingly (noted inline in the rules file).
