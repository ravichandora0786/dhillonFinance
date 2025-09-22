/**
 * Axios
 * Setup common url for api
 * @format
 */

import axios from "axios";

import endPoints from "./endpoints";
import store from "@/redux/store";
import { logoutApp, setAccessToken } from "@/app/common/slice";

const baseURL = process.env.NEXT_PUBLIC_API_STAGING_API_URL;
const apiTimeout = 30000;

const httpRequest = axios.create({
  baseURL,
  timeout: apiTimeout,
  headers: {
    "Content-Type": "application/json",
  },
});

httpRequest.interceptors.request.use((config) => {
  const token = store.getState().common.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpRequest.interceptors.response.use(
  (res) => {
    if (res?.data?.error) {
      return Promise.reject(new Error(res?.data?.error));
    }
    return res.data;
  },
  async (err) => {
    const originalRequest = err.config;
    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const {
          data: { accessToken },
        } = await axios.post(`${baseURL}${endPoints.RefreshToken}`, {
          refreshToken: store.getState().common.refreshToken,
        });

        if (!accessToken) {
          throw new Error("No access token returned from refresh API");
        }

        store.dispatch(setAccessToken(accessToken));
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return httpRequest(originalRequest);
      } catch (_error) {
        store.dispatch(logoutApp());
        return Promise.reject(_error);
      }
    }
    return Promise.reject(new Error(getErrorMessage(err)));
  }
);

// Utility to extract safe error message
const getErrorMessage = (error) => {
  const fallback = "Something went wrong. Try again!";

  if (!error) return fallback;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message === "Network Error")
    return "Network error. Please check your connection.";
  if (typeof error?.message === "string") return error.message;

  return fallback;
};

export { httpRequest, endPoints };
