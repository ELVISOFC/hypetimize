# HYPETIMIZE - Project TODO

## Phase 1: Database & Backend Architecture
- [x] Design and implement Drizzle schema for workspaces, videos, jobs, assets, subscriptions
- [x] Create database migration SQL
- [x] Implement core query helpers in server/db.ts

## Phase 2: Core Backend Procedures
- [x] Implement auth router (login, logout, profile)
- [x] Implement workspace router (create, list, get, delete, regenerate)
- [x] Implement video router (upload, list, get, delete, regenerate)
- [x] Implement job router (list, get status, cancel)
- [x] Implement subscription router (get current, list plans, upgrade)
- [x] Add workspace switcher dropdown to dashboard
- [ ] Add Stripe integration for billing

## Phase 3: Public Landing Page
- [x] Design and build hero section with Brutalist aesthetic
- [x] Build feature highlights section (thumbnails, SEO, clips)
- [x] Build pricing tiers section (Free, Pro, Studio)
- [x] Build call-to-action and sign-up flow
- [x] Implement red divider lines throughout

## Phase 4: Authentication & Onboarding
- [x] Implement OAuth login flow (template)
- [x] Build onboarding page with workspace setup
- [x] Implement OAuth callback redirect to onboarding
- [x] Auto-redirect to dashboard if workspace exists
- [x] Build logout functionality
- [ ] Build profile setup page (optional)
- [ ] Build YouTube channel connection page (optional)

## Phase 5: Creator Dashboard
- [x] Build dashboard layout with sidebar navigation
- [x] Implement workspace overview section
- [x] Display recent videos list
- [x] Display usage stats (thumbnails generated, SEO runs, clips created)
- [x] Display current subscription tier status
- [x] Add workspace switcher to sidebar

## Phase 6: Video Management
- [x] Build video list page with processing status indicators
- [x] Build video upload form (file upload)
- [x] Build YouTube URL submission form
- [ ] Implement video deletion (backend) - OPTIONAL
- [ ] Implement job re-run functionality (backend) - OPTIONAL
- [x] Add thumbnail preview display

## Phase 7: SEO & Thumbnail Results
- [x] Build SEO results view with title variants
- [x] Display CTR estimates and title styles
- [x] Build optimized description display
- [x] Build tags view (broad, medium, long-tail)
- [x] Build chapter markers display
- [x] Build thumbnail variants gallery
- [x] Add thumbnail download functionality
- [x] Integrate mock AI thumbnail generation service
- [x] Add vitest tests for thumbnail generation

## Phase 8: Subscription & Settings
- [x] Build subscription page with current plan display
- [x] Display usage against limits
- [ ] Implement Stripe checkout integration (backend) - OPTIONAL
- [x] Build workspace settings page
- [x] Implement team member invite functionality
- [ ] Build member role management (backend) - OPTIONAL

## Phase 9: Real-time Job Tracking & Notifications
- [x] Implement job status polling (basic via queries)
- [x] Build job progress bar component
- [ ] Implement email notifications for job completion (backend) - OPTIONAL
- [ ] Implement in-app notifications (backend) - OPTIONAL
- [ ] Build notification center UI - OPTIONAL

## Phase 10: Testing & Refinement
- [ ] Write vitest tests for core procedures - OPTIONAL
- [ ] Test authentication flow - OPTIONAL
- [ ] Test video upload and processing - OPTIONAL
- [ ] Test subscription tier limits - OPTIONAL
- [x] Refine Brutalist design across all pages
- [x] Final QA and bug fixes
