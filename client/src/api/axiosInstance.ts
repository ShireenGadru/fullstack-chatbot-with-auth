import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
console.log(baseUrl);

const publicAPI = axios.create({
  baseURL: `${baseUrl}/api/users`,
  withCredentials: true,
});

const securedAPI = axios.create({
  baseURL: `${baseUrl}/api/users`,
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    // Make request to refresh access token

    await securedAPI.post("/refresh-token");
  } catch (err) {
    throw new Error("Unable to refresh token");
  }
};

// axios intercepter to catch expired token and refresh it

securedAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error?.response &&
      error?.response?.status === 401 &&
      !originalRequest?._retry
    ) {
      // set a flag to prevent infite retry loop
      originalRequest._retry = true;

      try {
        await refreshAccessToken();
        return securedAPI(originalRequest);
      } catch (refreshError) {
        // redirect to login if refershing fails
        console.log(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { securedAPI, publicAPI };
