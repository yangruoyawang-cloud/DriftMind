# Security Specification: 浮白 / DriftMind

## 1. Data Invariants
- A `JournalEntry` must belong to an authenticated user (`userId`).
- A user can only read, create, or update their own `JournalEntry` documents.
- `UserProfile` summaries are private to the user.
- Document IDs must be valid alphanumeric strings.
- Timestamps (`createdAt`, `updatedAt`) must be server-validated.

## 2. The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: Attempt to create an entry with someone else's `userId`.
2. **Resource Poisoning**: Use a 10KB string as a document ID.
3. **Ghost Field**: Add `isAdmin: true` to a profile during update.
4. **Timestamp Forgery**: Provide a client-side `createdAt` date in the past.
5. **Unauthorized Read**: Attempt to fetch another user's entry by ID.
6. **Bulk Scraping**: Attempt a collection-wide list query without a `userId` filter.
7. **Profile Hijack**: Attempt to update another user's `UserProfile`.
8. **Shadow Change**: Update a `JournalEntry` and change its `userId`.
9. **Terminal Edit**: (Optional) Try to edit an entry's `content` after it's been finalized (immutability).
10. **Empty Entry**: Create an entry with no content or negative content lengths.
11. **Spoofed Email**: Access data by claiming an admin email but `email_verified` is false.
12. **Recursive Leak**: Attempt to use `get()` in a list query to skip filters.

## 3. Test Runner (Planned)
The `firestore.rules` will be validated against these payloads.
