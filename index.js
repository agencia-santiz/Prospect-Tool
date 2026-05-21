import { onRequest } from 'firebase-functions/v2/https';
import { createBackendRequestHandler } from './server/app.js';

const backendHandler = createBackendRequestHandler();

export const api = onRequest(
  {
    region: 'us-central1',
  },
  async (request, response) => {
    await backendHandler(request, response);
  }
);
