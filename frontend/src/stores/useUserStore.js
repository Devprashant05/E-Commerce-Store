import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ username, email, password, confirmPassword }) => {
        set({ loading: true });

        if ([password, confirmPassword].some((field) => field.length < 6)) {
            set({ loading: false });
            return toast.error("Password must be 6 characters long");
        }

        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Password do not match");
        }

        try {
            const result = await axios.post("/auth/signup", {
                username,
                email,
                password,
            });
            set({ user: result.data.data.user, loading: false });
            console.log(result.data);
            toast.success(result.data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data.message || "An error occured");
        }
    },

    login: async (email, password) => {
        set({ loading: true });
        try {
            const result = await axios.post("/auth/login", { email, password });
            set({ user: result.data.data.user, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data.message || "An error occured");
        }
    },

    logout: async () => {
        try {
            await axios.post("/auth/logout");
            set({ user: null });
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data.message || "An error occured");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const result = await axios.get("/auth/profile");
            set({ user: result.data.data, checkingAuth: false });
        } catch (error) {
            set({ checkingAuth: false, user: null });
        }
    },

    refeshToken: async () => {
        // Prevent multiple simultaneous refesh attempts
        if (get().checkingAuth) return;
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/refresh-token");
            set({ checkingAuth: false });
            return response.data.data;
        } catch (error) {
            set({ user: null, checkingAuth: false });
            throw error;
        }
    },

    // TODO: Implement the axios interceptors for refreshing accesst token
}));

//Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if ((error.response?.status === 401 && !originalRequest._retry)) {
            originalRequest._retry = true;
            try {
                // if a refresh is already in progress, wait it for complete
                if (refreshPromise) {
                    await refreshPromise;
                    return axios(originalRequest);
                }
                // start a new refresh process
                refreshPromise = useUserStore.getState().refeshToken();
                await refreshPromise;
                refreshPromise = null;
                return axios(originalRequest);
            } catch (refreshError) {
                // if refresh fails, redirect to login or handle as needed
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
