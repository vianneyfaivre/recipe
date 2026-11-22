# Recipe v2 for my personal blog

Svelte application to be used as a recipe template for vianneyfaivre.com

## Get started

see `run.sh` and `run-prod.sh`

navigate to [localhost:8080](http://localhost:8080)

When running `npm run dev`, a dev-only top bar lets you switch between the recipe yaml files in `public/` (via a `?yaml=<file>` query param). It is stripped from production builds.

## Building and running in production mode

see `deploy.sh`

## Tests

run `npm test`

## Code Checks

run `npm run check`