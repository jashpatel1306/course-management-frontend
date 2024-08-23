import axios from "axios";
import { BACKEND_BASE_URL } from "./baseurl";
const BACKEND_URL = BACKEND_BASE_URL;
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async function (config) {
    if (config.url !== "user/sign-in") {
      const admin = localStorage.getItem("admin");
      const authData = JSON.parse(admin)?.auth;
      const token = JSON.parse(authData)?.session.token;

      config.headers = {
        Authorization: `${token}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data;",
      };
    }
    // Do something before request is sent
    const formData = new FormData();

    if (config.data) {
      if (config?.data?.profile) {
        formData.append("avatar", config?.data?.profile);
        delete config?.data?.profile;
        delete config?.data?.avatar;
      } else {
        delete config?.data?.profile;
        delete config?.data?.avatar;
      }
      if (config?.data?.image) {
        formData.append("image", config?.data?.image);
        delete config?.data?.image;
      }
      if (config?.data?.images) {
        config?.data?.images.map((img) => formData.append("images", img));
        delete config?.data?.images;
      }
      formData.append("data", JSON.stringify(config.data));
    }
    config.data = formData;
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  async function (response) {
    // Do something with response data
    const result = response.data;
    return result;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);
export default axiosInstance;
