# Can Gayrimenkul — Real Estate Listing Platform (Based in Izmir / Turkiye)

#### Video Demo:

---

## Project Description

Can Gayrimenkul is a full-stack real estate listing management platform built for a boutique property agency based in Karşıyaka, İzmir, Turkey. The application provides two distinct surfaces: a public-facing listing portal where prospective buyers and renters can browse, filter, and examine property details, and a private admin panel where agency agents manage the entire listing lifecycle from creation to expiry.

The core problem this project solves is the inefficiency of managing real estate listings through generic tools such as spreadsheets or third-party portals that offer no direct control over presentation or data. Can Gayrimenkul gives the agency complete ownership of its content pipeline — agents can upload listing photos, set cascading location data (district → neighborhood), tag feature attributes, and toggle listing visibility, all without touching an external service.

The public experience is designed to reflect the agency's brand identity: a dark, luxury-aesthetic landing page transitions into a clean white listing directory with gold accent elements. Filtering is URL-driven, meaning any filtered search state can be bookmarked or shared as a link. Listing detail pages are dynamically generated with unique slugs, SEO metadata, and a full image carousel — giving each property a dedicated shareable URL.

The admin panel enforces role-based access. Agents with the `owner` role have full visibility across all listings and can generate cryptographically signed invitation tokens to onboard new `admin`-level agents. Password resets are handled via time-limited JWT links delivered by email, with no third-party identity provider involved.

---

## File-by-File Analysis

**`proxy.ts`** — Acts as Next.js middleware, intercepting all requests to `/admin/**`. Uses `jose` to verify the `admin_session` httpOnly JWT cookie on every request. Authenticated users visiting auth pages are redirected to the dashboard; unauthenticated users are redirected to login.

**`prisma/schema.prisma`** — Defines five models: `User`, `District`, `Neighborhood`, `Listing`, and `Image`. The `Listing` model contains 22 fields covering price, spatial dimensions, feature flags, and an `expireDate` field used to filter inactive listings from public queries automatically.

**`prisma/seed.ts`** — Parses `ilce-mahalle.csv` to bulk-insert all districts and neighborhoods in Izmir into the database, then creates the initial owner account from environment variables.

**`actions/auth.ts`** — Server Actions for login, logout, register, and password reset. `login()` uses `bcrypt.compare()` against the stored hash and issues a 5-day HS256 JWT. `requestPasswordReset()` generates a 30-minute JWT and sends a reset link via Nodemailer/Gmail.

**`actions/listing.ts`** — CRUD Server Actions for listings. `createListing()` and `updateListing()` handle concurrent Cloudinary image uploads using `Promise.all()`, generate a URL-safe slug with `slugify`, and persist everything in a single Prisma transaction. `deleteListing()` removes images from Cloudinary by folder prefix before deleting the database record.

**`actions/stats.ts`** — `getDashboardStats()` fires seven Prisma queries in parallel using `Promise.all()` to populate the admin dashboard: total listings, active count, monthly additions, sale/rent split, and top-5 districts by listing density.

**`actions/settings.ts`** — Three Server Actions for account management. `changePassword()` re-verifies the current password with `bcrypt.compare()` before hashing and saving the new one, preventing unauthorized changes from unattended sessions. `changeEmail()` validates the new address against a regex pattern and checks for duplicates with a Prisma `findUnique` before updating. `createInvitation()` enforces an ownership gate — it reads the caller's `role` from the database and returns an error immediately if the role is not `owner`. If authorized, it signs a 24-hour HS256 JWT carrying `{ purpose: "invite" }` and constructs the full registration URL using `NEXT_PUBLIC_BASE_URL`.

**`app/(public)/ilanlar/page.tsx`** — Server Component that receives `searchParams` as an async Promise (Next.js 15 requirement). It awaits and destructures up to seven URL parameters (`tur`, `ilce`, `mahalle`, `oda`, `minFiyat`, `maxFiyat`, `sirala`) with safe defaults, then fires `getPublicListings()` and `getDistricts()` in parallel via `Promise.all()`. The parsed filter object is forwarded directly to the Server Action, which translates each field into a Prisma `where` condition. A `hasFilters` boolean controls whether the "filter applied" indicator appears in the result count line, giving users visible confirmation that results are constrained.

**`app/(public)/ilan/[slug]/page.tsx`** — Server Component with a `generateMetadata()` export for per-listing dynamic SEO. The function fetches the listing by slug and populates the page `<title>` from the listing title and the meta description from the first 155 characters of the listing description. If `getPublicListingBySlug()` returns `null` — either because the slug does not exist or the listing has expired — `notFound()` is called, delegating rendering to `app/not-found.tsx`. Price is formatted using `Intl.NumberFormat` with the `tr-TR` locale and `TRY` currency; creation date is formatted with `Intl.DateTimeFormat` — both avoiding any external date or currency library.

**`hooks/useListingForm.ts`** — Custom React hook centralizing all listing form state, including client-side image file management (preview URLs, deletion tracking, upload staging) so form components remain stateless.

**`components/public/ListingsFilter.tsx`** — Client component that writes filter state directly to the URL using `useRouter` and `useSearchParams`, enabling the parent Server Component to re-fetch filtered data on navigation without any client-side state.

**`components/admin/listing/ImageUploadSection.tsx`** — Handles multi-image file selection with client-side preview thumbnails. Enforces a 10-image, 5 MB-per-file limit before the upload ever reaches the server.

**`lib/prisma.ts`** — Prisma client singleton using `@prisma/adapter-pg` with a native `pg.Pool`. The global singleton pattern prevents connection pool exhaustion during Next.js hot reloads in development.

**`types/types.ts`** — Single source of truth for all shared TypeScript types across the application. Uses an inheritance hierarchy: `DetailedListing extends BaseListing`, adding 20+ property-specific fields. `ListingFields` is derived via `Omit<DetailedListing, "id" | "images">` and used as the canonical form state type in `useListingForm`, ensuring the hook and the Server Action always agree on field names. `AdminListing` extends `BaseListing` with admin-only fields (`listingNumber`, `isActive`, `slug`, nested `user` relation). `DashboardStats` represents the exact shape returned by `getDashboardStats()`, keeping the dashboard page and the stats action in sync at compile time.

**`lib/constans.ts`** — Exports two objects. `featureOptions` holds labeled option arrays for every categorical listing field: `ROOM` (11 entries from 1+0 to 6+), `KITCHEN` (3), `PARKING` (4), `HEATING` (6), and `FLOOR` (24 entries). These arrays are consumed by both the admin listing form selects and the public filter sidebar, ensuring both surfaces always present identical, consistent options without duplication. `menuItems` defines the admin sidebar navigation entries (Dashboard, İlanlarım, Yeni İlan Ekle, Ayarlar) with their paths and Lucide icon references, keeping navigation structure out of the component tree.

---

## Design Choices

**Next.js App Router over a traditional REST API:** Rather than building a separate Express or Flask API, all data fetching happens directly in Server Components and all mutations go through Server Actions. This eliminates the network round-trip between a frontend and a backend, reduces the attack surface (no public API endpoints to secure), and allows form submissions to work even without JavaScript — a progressive enhancement built into the framework by default.

**Custom JWT authentication over NextAuth:** NextAuth abstracts authentication behind a generic adapter layer that adds significant complexity for a system with only two roles and no OAuth providers. A custom `jose`-based implementation gave full control over token shape, cookie attributes, and role-based redirect logic, all in under 150 lines of code. The tradeoff is that session revocation requires token expiry rather than a database lookup, which is acceptable for the 5-day session window used here.

**PostgreSQL with Prisma over a document database:** Listing data is highly relational — a `Listing` belongs to one `District`, one `Neighborhood`, one `User`, and has many `Image` records. A document database would require embedding or manual reference management for this hierarchy. Prisma's type-safe query builder also eliminates an entire class of runtime errors by catching invalid field access at compile time.

**URL-driven filter state over React state:** Storing filter parameters in the URL means the server does the filtering work — no client-side filtering logic, no stale state between navigations, and filtered searches are shareable and indexable. The filter component only writes to the URL; the listing page reads from it as a plain object.

**Cloudinary for image storage with folder-per-listing organization:** Storing images under `listings/{listingId}/` allows batch deletion by folder prefix when a listing is removed, without needing to track individual public IDs in the database. The 20 MB Server Action body limit in `next.config.ts` enables multi-image uploads in a single request.

**shadcn/ui over a traditional component library:** Unlike libraries such as Material UI or Chakra UI that ship pre-compiled components as npm packages, shadcn/ui copies component source code directly into the project under `components/ui/`. This means every primitive — `Button`, `Card`, `Select`, `AlertDialog` — is fully owned and editable code rather than a black-box dependency. For a project with a custom brand identity (gold accents, specific border radius, dark/light theme split between the public and admin surfaces), this ownership is critical: the admin panel's color scheme integrates directly with the CSS custom properties defined in `globals.css`, and any component can be modified without fighting library internals or overriding deeply nested styles. The tradeoff is a larger `components/ui/` directory, but the gain in design flexibility and zero lock-in to a third-party release cycle justifies it for a client-facing production application.

---

## Technical Challenges

The most significant challenge was image management during listing edits. An edit operation may involve keeping some existing Cloudinary images, deleting others, and uploading new ones — all atomically. The solution was to pass three separate arrays from the client: `existingImages` (keep), `deletedImageIds` (remove from Cloudinary), and `newImages` (upload). The Server Action processes deletions and uploads in parallel before the database write, and rolls back conceptually if either fails.

A secondary issue was Recharts requiring CSS custom properties to resolve at SVG attribute level — `var(--color-chart-N)` (a Tailwind v4 `@theme inline` variable) was not emitted as a runtime CSS property, causing all chart bars to render black. The fix was to reference the underlying `:root` variables (`var(--chart-N)`) directly in data item `fill` fields, combined with per-bar `Cell` components to apply individual colors.

---

## Installation & Usage

### Environment Variables

Copy `.env.example` to `.env` and fill in each value as described below.

---

**`DATABASE_URL`**
A PostgreSQL connection string. Options:

- **Local:** Install PostgreSQL, create a database (`createdb can_gayrimenkul`), then use `postgresql://USER:PASSWORD@localhost:5432/can_gayrimenkul`
- **Cloud:** Create a free database on [Supabase](https://supabase.com). After creating the project, copy the connection string from the dashboard (Project → Project Settings → Connect → ORM's → Prisma). Use the **pooled** connection string for production.

---

**`JWT_SECRET`**
An arbitrary secret string used to sign and verify all JWTs (session tokens, password reset links, invite links). Generate a secure value with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

**`NEXT_PUBLIC_BASE_URL`**
The full public URL of the application, without a trailing slash.

- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

---

**`ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME`**
Credentials for the initial `owner` account created by the seed script. These are only used once during `prisma db seed` and can be any values you choose. After seeding, log in at `/admin/giris-yap` with these credentials.

---

**`GMAIL_USER` / `GMAIL_APP_PASSWORD`**
Used by Nodemailer to send password reset emails via Gmail.

1. Use or create a Gmail account for the application.
2. Enable 2-Step Verification on the account (required for App Passwords): Google Account → Security → 2-Step Verification.
3. Generate an App Password: Google Account → Security → 2-Step Verification → App passwords. Select "Mail" and generate.
4. Set `GMAIL_USER` to the Gmail address and `GMAIL_APP_PASSWORD` to the 16-character app password.

---

**`CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`**
Used for listing image storage and CDN delivery.

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. From the Cloudinary Console dashboard, all three values are visible under **API Keys** in the top section.
3. `CLOUDINARY_CLOUD_NAME` is the cloud name shown in the URL bar and dashboard (e.g. `dxyz123`).
4. Click **API Keys** → the default key shows `API Key` and `API Secret` (reveal with the eye icon).

---

### Setup Commands

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment variables
cp .env.example .env
# Fill in all values as described above

# 3. Run database migrations
pnpm dlx prisma migrate deploy

# 4. Seed the database (districts, neighborhoods, owner account)
pnpm dlx prisma db seed

# 5. Start development server
pnpm dev

# 6. Build for production
pnpm build && pnpm start
```

The application runs on `http://localhost:3000`. The admin panel is accessible at `/admin/giris-yap` using the credentials defined in the seed environment variables.
