# Student profile database migration (not applied)
This SQL is a **reviewable, unexecuted migration**. It adds parent-owned student records and Row Level Security. It does not alter the current browser-local profiles, and there is **no cross-device sync until the application is wired to this table**.

## Apply and validate
1. Review `supabase/students.sql` and run it in the correct Supabase project's SQL Editor after approval.
2. Test using two separate parent accounts and an unauthenticated session. Parent A's records must be invisible and unmodifiable to parent B; a forged `parent_id` insert must fail.
3. Only after these tests pass, update the website to use Supabase CRUD instead of localStorage, with an explicit one-time import choice for existing local data.
4. Never store passwords, service-role keys, or other secrets in frontend JavaScript. The publishable key alone is not authorization; RLS is mandatory.
