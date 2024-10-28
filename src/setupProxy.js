/* eslint-disable import/no-anonymous-default-export */
// src/setupProxy.js
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://backend-test-phi-one.vercel.app', // Target API URL
      changeOrigin: true, // Changes the origin of the host header to the target URL
      cookieDomainRewrite: {
        "*": "", // Rewrite the domain of the cookies to avoid issues
      },
      credentials: true, // Allow credentials (for cookies)
    })
  );
}
