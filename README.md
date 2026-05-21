<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5dcc15c1-0baa-4a6a-a4ad-3e73e7f9b837

## Documentacao completa

Se voce quer entender o produto antes de mexer no codigo, leia primeiro [DOCUMENTACAO_DO_APP.md](./docs/DOCUMENTACAO_DO_APP.md). Ele consolida o fluxo atual, as APIs externas, a persistencia local e o que ainda e simulacao.

Se voce quer entender a proxima evolucao do produto, leia [ROADMAP_TECNICO.md](./docs/ROADMAP_TECNICO.md) e a pesquisa base [bloom_leads_pesquisa_tecnica_estrategica.md](./docs/bloom_leads_pesquisa_tecnica_estrategica.md).

Se voce quer a lista executavel de tarefas, leia [BACKLOG_EXECUTAVEL.md](./docs/BACKLOG_EXECUTAVEL.md).

Se voce quer a trilha desktop executavel + backend hibrido, leia [BACKLOG_HIBRIDO_DESKTOP.md](./docs/BACKLOG_HIBRIDO_DESKTOP.md).

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the backend `GEMINI_API_KEY` in [.env.local](.env.local) or in the shell where you run `npm run backend`
3. Set the Firebase web config in [.env.local](.env.local) so the frontend can initialize Auth and Firestore:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Optional: set `CNPJ_API_BASE_URL`, `CNPJ_API_TOKEN` and `CNPJ_API_KEY` if you want sector validation by official CNPJ data
5. Run the frontend:
   `npm run dev`
6. Run the backend base:
   `npm run backend`
7. Run the desktop shell in hybrid mode, which starts the backend locally:
   `npm run desktop:dev`
8. Build the Windows installer:
   `npm run desktop:installer`
9. Stage the local update feed from the installer artifacts:
   `npm run desktop:feed:stage`
10. Serve the staged update feed for local testing:
   `npm run desktop:feed:serve`
11. Run the desktop release smoke check:
   `npm run desktop:release:smoke`

O empacotamento desktop local usa `asar: false` nesta fase para manter o instalador Windows estavel com o fluxo atual do Electron Builder.
O auto-update desktop fica ativo no app empacotado quando `BLOOM_UPDATE_URL` aponta para um feed HTTP(S) valido com os arquivos gerados pelo `electron-builder`.
Para teste local, o feed padrao fica em `updates/windows-x64` e pode ser servido em `http://127.0.0.1:8090/windows-x64`.
O estado local do desktop fica em `userData/persistent-state.json`, o que substitui o papel estrutural do `localStorage` para o core do app.
Os logs persistentes do desktop ficam em `userData/logs/desktop.log`, com rotacao simples.
O guia de operacao e recuperacao do desktop fica em [docs/DESKTOP_OPERACAO_RECUPERACAO.md](./docs/DESKTOP_OPERACAO_RECUPERACAO.md).

## Deploy online

This repository is set up to run online with:

- Firebase Hosting for the Vite frontend
- Firebase Cloud Functions for the `/api` backend
- Firebase Data Connect for synced workspace data

Production build settings live in [.env.production](.env.production):

- `VITE_BACKEND_URL=/api`
- `VITE_ENABLE_DATACONNECT_SYNC=true`

Before deploying, make sure your local [.env](.env) includes the backend keys used by the server:

- `GOOGLE_MAPS_API_KEY`
- `GEMINI_API_KEY`

Typical deploy flow:

1. Build the app:
   `npm run build`
2. Deploy functions and hosting:
   `npx -y firebase-tools@latest deploy --only functions,hosting`
3. Deploy Data Connect if you want synced workspace data online:
   `npx -y firebase-tools@latest deploy --only dataconnect`

The backend function is exposed under `/api`, so the deployed frontend and backend stay on the same Firebase domain.

The backend starts on `http://127.0.0.1:8787` by default and exposes:

- `GET /` for the module manifest
- `GET /health` for the healthcheck
- `GET /version` for the backend version snapshot
- `POST /search/enrich` for lead enrichment, with sector validation metadata when leads carry CNPJ/CNAE evidence
- OSM/Nominatim/Overpass stays as an auxiliary backend layer when the main sources need complementary coverage
- The backend normalizes company name, address, phone, website and coordinates before returning leads
- The backend deduplicates high-confidence matches and flags suspicious duplicates for review
