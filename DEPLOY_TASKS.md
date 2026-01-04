# Deployment Tasks for Vercel

**Start Time: 3:00 PM**

---

## Pre-Deployment Setup

### 1. Database Schema Updates
- [ ] Review current schema in `/packages/convex/convex/schema.ts`
- [ ] Make any pending schema changes
- [ ] Test schema changes locally with `npx convex dev`
- [ ] Deploy schema to production:
  ```bash
  cd packages/convex
  npx convex deploy --prod
  ```
- [ ] Verify schema deployed correctly in Convex dashboard

**Estimated time: 30-60 minutes**
*(Depends on complexity of schema changes; migrations may require manual data handling)*

**>>> TARGET: 4:00 PM <<<**
**>>> ACTUAL:  <<<**

---

### 2. Clerk Production Setup
- [ ] Create a Clerk production instance (or switch existing to production mode)
- [ ] Note the production `CLERK_SECRET_KEY` (starts with `sk_live_`)
- [ ] Note the production `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_`)
- [ ] Configure production domain in Clerk dashboard (e.g., `your-app.vercel.app` or custom domain)
- [ ] Update allowed redirect URLs in Clerk for production domain

**Estimated time: 30-45 minutes**
*(Account creation, understanding dashboard, domain verification if custom)*

**>>> TARGET: 4:45 PM <<<**
**>>> ACTUAL:  <<<**

---

### 3. Convex Production Deployment
- [ ] Log into Convex dashboard: https://dashboard.convex.dev
- [ ] Create a new production deployment for "design-monorepo-6b6b0" project
- [ ] Run schema deployment from `packages/convex`:
  ```bash
  cd packages/convex
  npx convex deploy --prod
  ```
- [ ] Note the production `CONVEX_URL` (will be different from dev URL)
- [ ] Note the production `CONVEX_DEPLOYMENT` identifier

**Estimated time: 20-30 minutes**
*(First production deploy, potential schema review)*

**>>> TARGET: 5:15 PM <<<**
**>>> ACTUAL:  <<<**

---

### 4. Update Convex Auth Config for Production
- [ ] Update `/packages/convex/convex/auth.config.ts` to use Clerk production domain
  ```typescript
  providers: [
    {
      domain: "https://YOUR_CLERK_PRODUCTION_DOMAIN.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
  ```
- [ ] Re-deploy Convex after auth config change:
  ```bash
  npx convex deploy --prod
  ```

**Estimated time: 15-20 minutes**
*(Finding correct domain, testing auth flow)*

**>>> TARGET: 5:35 PM <<<**
**>>> ACTUAL:  <<<**

---

## Vercel Deployment

### 5. Connect Repository to Vercel
- [ ] Log into Vercel: https://vercel.com
- [ ] Import the Git repository
- [ ] Select `apps/web` as the root directory (for the main app)
- [ ] Framework preset should auto-detect as Next.js

**Estimated time: 10-15 minutes**

**>>> TARGET: 5:50 PM <<<**
**>>> ACTUAL:  <<<**

---

### 6. Configure Build Settings
- [ ] Set build command: `cd ../.. && pnpm install && pnpm turbo run build --filter=web`
- [ ] Set output directory: `.next`
- [ ] Set install command: `pnpm install`
- [ ] Set Node.js version to 18.x or 20.x

**Estimated time: 15-30 minutes**
*(Monorepo builds can be tricky; may need iteration)*

**>>> TARGET: 6:20 PM <<<**
**>>> ACTUAL:  <<<**

---

### 7. Set Environment Variables in Vercel
- [ ] Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (production key)
- [ ] Add `CLERK_SECRET_KEY` (production key)
- [ ] Add `NEXT_PUBLIC_CONVEX_URL` (production Convex URL)
- [ ] Add `CONVEX_DEPLOYMENT` (production deployment ID)
- [ ] Add `CONVEX_URL` (production Convex URL)

**Estimated time: 10-15 minutes**

**>>> TARGET: 6:35 PM <<<**
**>>> ACTUAL:  <<<**

---

### 8. Deploy and Verify
- [ ] Trigger initial deployment
- [ ] Wait for build to complete
- [ ] Test the deployed URL
- [ ] Verify Clerk authentication works
- [ ] Verify Convex connection works (check favorites feature)
- [ ] Check browser console for errors

**Estimated time: 20-45 minutes**
*(Build failures, debugging, cache issues)*

**>>> TARGET: 7:20 PM <<<**
**>>> ACTUAL:  <<<**

---

## Post-Deployment

### 9. Custom Domain (Optional)
- [ ] Add custom domain in Vercel dashboard
- [ ] Update DNS records at domain registrar
- [ ] Wait for DNS propagation
- [ ] Update Clerk allowed domains
- [ ] Update Convex auth config if using custom domain

**Estimated time: 30-60 minutes**
*(DNS propagation can take time)*

**>>> TARGET: 8:20 PM <<<**
**>>> ACTUAL:  <<<**

---

### 10. Final Verification
- [ ] Test full authentication flow (sign up, sign in, sign out)
- [ ] Test favorites functionality (add, remove)
- [ ] Test on mobile device
- [ ] Check for HTTPS/SSL issues
- [ ] Verify no dev keys are exposed in production

**Estimated time: 20-30 minutes**

**>>> TARGET: 7:50 PM (without custom domain) / 8:50 PM (with custom domain) <<<**
**>>> ACTUAL:  <<<**

---

## Troubleshooting Checklist

If build fails:
- [ ] Check Vercel build logs for specific error
- [ ] Ensure pnpm is being used (not npm)
- [ ] Verify all environment variables are set
- [ ] Check that monorepo root directory setting is correct

If auth doesn't work:
- [ ] Verify Clerk production keys are set
- [ ] Check Clerk dashboard for allowed origins/redirects
- [ ] Ensure Convex auth.config.ts has correct Clerk domain

If database doesn't work:
- [ ] Verify NEXT_PUBLIC_CONVEX_URL is correct
- [ ] Check Convex dashboard for deployment status
- [ ] Ensure schema was deployed to production

---

## Time Estimates Summary

| Task | Pessimistic Estimate | Target |
|------|---------------------|--------|
| Database Schema Updates | 60 min | 4:00 PM |
| Clerk Production Setup | 45 min | 4:45 PM |
| Convex Production Deployment | 30 min | 5:15 PM |
| Update Auth Config | 20 min | 5:35 PM |
| Connect to Vercel | 15 min | 5:50 PM |
| Configure Build Settings | 30 min | 6:20 PM |
| Set Environment Variables | 15 min | 6:35 PM |
| Deploy and Verify | 45 min | 7:20 PM |
| Custom Domain (optional) | 60 min | 8:20 PM |
| Final Verification | 30 min | 7:50 / 8:50 PM |

---

## **TARGET FINISH: 7:50 PM** (without custom domain)
## **TARGET FINISH: 8:50 PM** (with custom domain)

## **ACTUAL FINISH:  **

---

*Note: These estimates assume some familiarity with the services. First-time users may need additional time for account setup and learning the dashboards.*
