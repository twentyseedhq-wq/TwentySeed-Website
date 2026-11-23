# TwentySeed Learning authentication setup

Status: frontend integration only. **Not production-ready** until the following are completed and tested.

1. Create a Supabase Free project in the TwentySeed account. This is a user-controlled account action; no project was created automatically.
2. In Supabase Authentication > Providers, enable Email and require email confirmation.
3. Configure Authentication > URL Configuration: site URL `https://twentyseed-website.pages.dev`; redirect allow-list `https://twentyseed-website.pages.dev/login.html` (and any exact production custom domain later).
4. Copy only the Project URL and **publishable/anon key** to `supabase-config.js`. Never commit a service_role/secret key.
5. Configure a production SMTP/email provider before public signup. Supabase's default email delivery has restrictive limits and is not intended for general production.
6. Test signup, verification, incorrect password, sign-in, sign-out, reset email, expired reset links, password change, and session expiry in a real browser.
7. **Security requirement:** Current parent profiles and subscription preview live in browser localStorage, which is not private per account. Before real family use, move profiles into Supabase tables with row-level security (RLS) and policies scoped to `auth.uid()`; do not treat the static dashboard or client-side gate as a server authorization boundary. Keep private records out of publicly served static assets. Ensure all private APIs enforce authorization independently.
8. Add abuse protections and rate limits for signup/reset, review password policies and email templates, and monitor authentication logs.

No real payments, outbound emails, or paid services have been enabled by this code.
