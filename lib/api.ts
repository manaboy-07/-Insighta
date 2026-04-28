import { baseURL } from "@/app/utils/baseUrl";
import axios from "axios";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
// 🔍 REQUEST LOGGER
api.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL}${config.url}`;

  console.log("\n🚀 REQUEST:");
  console.log("URL:", fullUrl);
  console.log("METHOD:", config.method?.toUpperCase());
  console.log("PARAMS:", config.params);
  console.log("BODY:", config.data);
  console.log("HEADERS:", config.headers);

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;

    if (status === 401) {
      try {
        await axios.post(
          "http://localhost:3000/auth/refresh",
          {},
          { withCredentials: true },
        );

        return api(err.config);
      } catch {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      window.location.href = "/unauthorized";
    }

    return Promise.reject(err);
  },
);
export const getProfilesPage = (page: number, limit: number) => {
  api
    .get(`/api/profiles?page=${page}&limit=${limit}`, {
      headers: {
        "X-API-Version": "1",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};
export const getAllProfiles = () => {
  api
    .get("/api/profiles")
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};

export const searchProfile = (query: string) => {
  api
    .get("/api/profiles/search?q=nigeria", {
      headers: { "X-API-Version": "1" },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};

export const profileDetail = (id: string) => {
  api
    .get(`/api/profiles/${id}`, {
      headers: { "X-API-Version": "1" },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};
