import { create } from "zustand"
import axiosInstance from "../utils/axiosInstance"

export const useAuth = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

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

            console.log(response);


            set({ user: response.data.user, isAuthenticated: true, isLoading: false, error: null })

        } catch (error) {
            set({ error: error.response.data.message || "Error In Signup" })
            throw error;
        }
    },

    checkAuth: async () => {

        set({ isCheckingAuth: true, error: null })

        try {
            const response = await axiosInstance.get("/check-auth")

            set({ user: response.data.user, isAuthenticated: true, isLoading: false })

            return response.data;

        } catch (error) {
            set({ error: null, isCheckingAuth: false })
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null })

        try {

            const response = await axiosInstance.post("/forgot-password", { email })

            set({ message: response.data.message, isLoading: false, error: null })

        } catch (error) {
            set({ error: error.response.data.message || "Error In Forgot Password", isLoading: false })
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null, message: null })

        try {

            const response = await axiosInstance.post(`/reset-password/${token}`, { password })

            set({ message: response.data.message, isLoading: false, error: null })

        } catch (error) {
            set({ error: error.response.data.message || "Error In Forgot Password", isLoading: false })
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.post("/logout")

            set({ user: null, isAuthenticated: false, isLoading: false, error: null })

        } catch (error) {
            set({ error: error.response.data.message || "Error In Logout", isLoading: false })
            throw error;
        }
    }
}))
