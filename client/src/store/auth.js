import { create } from "zustand"
import axiosInstance from "../utils/axiosInstance"

export const useAuth = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,

    signup: async (email, password, name) => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.post("/signup", {
                email, password, name
            })

            set({ user: response.data.user, isAuthenticated: true, isLoading: false })

        } catch (error) {
            set({ error: error.response.data.message || "Error In Signup" })
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.post("/verify-email", {
                code
            })

            set({ user: response.data.user, isAuthenticated: true, isLoading: false })

            return response.data;

        } catch (error) {
            set({ error: error.response.data.message || "Error In Signup" })
            throw error;
        }

    },

    login: async (email, password) => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.post("/login", {
                email, password
            })

            set({ user: response.data.user, isAuthenticated: true, isLoading: false, error: null })

        } catch (error) {
            set({ error: error.response.data.message || "Error In Signup" })
            throw error;
        }
    },

    checkAuth: async () => {

        await new Promise((resolve) => {
            setTimeout(resolve, 2000)
        })

        set({ isCheckingAuth: true, error: null })

        try {
            const response = await axiosInstance.get("/check-auth")

            set({ user: response.data.user, isAuthenticated: true, isLoading: false })

            return response.data;

        } catch (error) {
            set({ error: null, isCheckingAuth: false })
            throw error;
        }
    },
    logout: async () => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.post("/logout")

            set({ isAuthenticated: false, isLoading: false, error: null })

        } catch (error) {
            set({ error: error.response.data.message || "Error In Logout" })
            throw error;
        }
    }
}))
