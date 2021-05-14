import { HttpError } from './errors';

// Handle HTTP errors.
export default (client, tokenName) => {
  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(tokenName);

      const newConfig = config;

      // When a 'token' is available set as Bearer token.
      if (token) {
        newConfig.headers.Authorization = `Bearer ${token}`;
      }

      return newConfig;
    },
    err => Promise.reject(err),
  );

  // Response interceptor
  client.interceptors.response.use(
    response => response,
    (error) => {
      const { status, data } = error.response;

      if (status < 200 || status >= 300) {
        return Promise.reject(
          new HttpError(data, status),
        );
      }

      return Promise.reject(error);
    },
  );
};
