# Deploy the coordinated generation fixes

Deploy this frontend together with the matching `sera-backend` changes.

1. Set `GENERATION_SERVICE_TOKEN` to the same random secret on the frontend and API service. Generate a new value with `openssl rand -hex 32`.
2. Set a separate `GENERATION_CALLBACK_SECRET` on the frontend, API service, and Celery workers. Generate it independently. Never use a `NEXT_PUBLIC_` variable for either secret.
3. Set `GENERATION_CALLBACK_URL` on the API service and workers to the frontend's HTTPS `/api/generate-callback` URL. Requests can no longer supply a callback destination.
4. Apply the additive database change before starting the new frontend:
   ```sh
   npx prisma db execute --file prisma/sql/generation-jobs.sql --schema prisma/schema.prisma
   npx prisma generate
   ```
   This repository has no existing migration baseline; the SQL is intentionally additive and repeatable, rather than introducing an incomplete migration history.
5. Drain old generation jobs, then deploy both services and restart workers. Old unsigned callbacks are rejected.
6. Smoke-test payment-gated generation, delivery to the correct gallery, and deletion followed by refresh.

The legacy `/api/uploadcare` GET and DELETE now share the authenticated, owner-scoped generated-image handlers. Its POST returns 410; workers use the signed callback instead. Callback responses contain no user record.

Only one generation may be pending per user. A callback atomically consumes its job ID; retries acknowledge completed jobs without overwriting the gallery again. Empty, stale, or unsigned callbacks never replace images. Storage deletions remove only the selected UUID atomically from the database.

If enqueueing has an ambiguous transport failure, training fails, or callback delivery exhausts retries, inspect Celery using `pendingGenerationId` as the task ID. Do not automatically retrain paid GPU jobs. After confirming that the job cannot still complete, an operator may clear that specific user's matching `pendingGenerationId` to permit a retry. Preserve uploaded outputs for manual callback recovery if delivery failed. Never clear a newer job's ID.

Validation: `node --test tests/generation.test.cjs`; `npx prisma generate`; `npx tsc --noEmit`. Route tests use mocked auth, storage, and database boundaries; real PostgreSQL/storage/GPU deployment still requires a smoke test.
