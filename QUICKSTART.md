# Sera Studio — runnable workbench

Build a session, preview your source photos and export a reproducible generation brief.

## Open the interface

Python 3.10+; no npm install, API keys, model download or GPU required for the demo.

```sh
python serve_demo.py
```

Open <http://127.0.0.1:8000>. To use another port: `python serve_demo.py --port 8001`.
Serve `demo/` over HTTP rather than opening `index.html` as a file. The server binds only to localhost.

## What is implemented

The browser demo previews local image files and exports a session brief. It does not call the production app. The Next.js app needs the environment variables and services documented in `GENERATION_DEPLOYMENT.md`, a database and valid service credentials. The earlier security fixes are inherited by this branch.

Interface capabilities: Photo preview, Style direction, Session export.

## Core workflow

From the repository root (install the project's existing dependencies first for model-backed commands):

```sh
npm ci
npx prisma generate
npx tsc --noEmit
npm run dev
```

## Verify

The browser's calculation tests use Node 18+ and no third-party packages:

```sh
node --test demo/core.test.cjs
node --test tests/*.test.*
```

The GitHub demo workflow checks browser calculations and the dependency-free core tests where present. Full original model/service suites have separate dependencies; passing demo checks does not certify GPU training or external services.

## Before live use

Live generation needs the paired worker, PostgreSQL, Uploadcare, service secrets and payment configuration.

Local browser data belongs to this browser profile. Export records before clearing it or changing devices. Photo previews stay in memory; exported briefs contain filenames, not uploaded image bytes. There are no payment or outbound model calls in this demo.

## Provenance

Workbench and starter additions: AI-assisted implementation, 2026-11-13, for Ray's review. Existing repository history and upstream attribution are preserved. New starter directions are proposals where the GitHub repository had no code.
