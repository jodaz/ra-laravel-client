import { HttpError } from './errors';

// Handle HTTP errors.
export default (instance, tokenName) => {
  // Request interceptor
  instance.interceptors.request.use(
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
  instance.interceptors.response.use(
    response => {
      const { status, data } = response;

      if (status < 200 || status >= 300) {
        return Promise.reject(HttpError(data, status));
      }
    },
    (error) => Promise.reject(error),
  );
};
