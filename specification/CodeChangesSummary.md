# Code Changes Needed for Role-Based News Filtering

This document summarizes the necessary code changes to implement news filtering based on user access to specific housing companies.

---

## 1. Update User Interface in Auth Service

**File:** `src/services/auth.ts`

- Extend the `User` interface to include `housing_companies` array of housing company IDs.
- Modify the `signInWithAccessCode` method to fetch the user's housing company access from the `user_housing_companies` table and include it in the returned user object.

---

## 2. Update News Service

**File:** `src/services/newsService.ts`

- Extend the `SupabaseNewsItem` interface to include `housing_company_id` and related housing company name.
- Add a new method `fetchNewsForHousingCompanies(housingCompanyIds: string[])` to fetch news filtered by housing company IDs.
- Modify existing methods to include housing company info in the fetched data.
- Update the data transformation method to map housing company info.

---

## 3. Update useNews Hook

**File:** `src/services/useNews.ts`

- Add a `user` parameter to the hook configuration.
- Modify the news loading logic to fetch news filtered by the user's housing companies using the new method in `NewsService`.
- Handle cases where the user has no housing company access by returning empty news and appropriate error messages.

---

## 4. Update Background Sync Manager

**File:** `src/services/backgroundSync.ts`

- Add support for passing the user context.
- Modify the sync logic to fetch incremental news updates filtered by the user's housing companies.

---

## 5. Update News Screen

**File:** `src/screens/UutisetScreen.tsx`

- Load the current user from storage or context.
- Pass the user object to the `useNews` hook to enable filtered news fetching.
- Handle loading and error states appropriately.

---

## Summary

These changes ensure that news items are fetched and displayed only for the housing companies the logged-in user has access to, enforcing role-based access control at the application level while leveraging the database schema changes.

For detailed code snippets and examples, please refer to the `RoleBasedNewsFilteringPlan.md` specification file.

---

This summary can guide the implementation of the role-based news filtering feature.