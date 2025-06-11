# Supabase Auth Integration Plan for Custom Users Table

## Background

Your app currently uses a custom `users` table for authentication and user metadata, separate from Supabase's built-in Auth users. This causes a disconnect between Supabase Auth users and your app's user data.

## Goal

Integrate Supabase Auth with your custom `users` table to unify authentication and user metadata management.

## Proposed Approach

1. **Create users in Supabase Auth**:
   - Use Supabase dashboard or API to create users with email and password.
   - These users are managed by Supabase Auth.

2. **Sync or create corresponding entries in the custom `users` table**:
   - Store additional metadata like `role`, `access_code`, and housing company access.
   - Link entries via the Supabase Auth user `id` or `email`.

3. **Modify app authentication flow**:
   - Use Supabase Auth for sign-in/sign-up.
   - After successful sign-in, fetch user metadata from the custom `users` table.
   - Store combined user info in app state.

4. **Migration of existing users**:
   - For existing users in the custom `users` table, create corresponding Supabase Auth users.
   - Sync passwords or reset them as needed.

## Implementation Steps

- Add a `supabase_user_id` column to the custom `users` table to link to Supabase Auth users.
- Update sign-in and sign-up flows to use Supabase Auth methods.
- After authentication, query the custom `users` table by `supabase_user_id` to get metadata.
- Adjust role-based news filtering to use this unified user object.

## Benefits

- Leverages Supabase's secure, scalable authentication.
- Maintains custom user metadata and access control.
- Simplifies user management and security.

## Next Actions

- I can help you write migration scripts to add `supabase_user_id` to your `users` table.
- Assist in updating authentication code to use Supabase Auth.
- Provide scripts to migrate existing users.

Please confirm if you want to proceed with this integration plan.