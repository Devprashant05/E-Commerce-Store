import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: false,

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
            toast.success(result.data.message + " Please login now.");
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

    // TODO: Implement the axios interceptors for refreshing accesst token
}));

export { useUserStore };
