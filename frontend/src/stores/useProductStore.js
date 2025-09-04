import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useProductStore = create((set, get) => ({
    loading: false,
    products: [],

    setProducts: (products) => {
        set({ products });
    },

    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const result = await axios.post("/products", productData);
            set((prevState) => ({
                products: [...prevState.products, result.data.data],
                loading: false,
            }));
            toast.success(result.data.message);
        } catch (error) {
            toast.error(error.response.data.error);
            set({ loading: false });
        }
    },

    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/products");
            set({ products: response.data.data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch products", loading: false });
            toast.error(
                error.response.data.error || "Failed to fetch products"
            );
        }
    },

    deleteProduct: async (productId) => {
        set({ loading: true });
        try {
            const response = await axios.delete(`/products/${productId}`);
            set((prevState) => ({
                products: prevState.products.filter(
                    (product) => product._id !== productId
                ),
                loading: false,
            }));
            toast.success(response.data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(
                error.response.data.message || "Failed to delete product"
            );
        }
    },

    toggleFeaturedProduct: async (productId) => {
        set({ loading: true });
        try {
            const response = await axios.patch(`/products/${productId}`);
            // console.log(response.data.data.isFeatured);
            set((prevState) => ({
                products: prevState.products.map((product) =>
                    product._id === productId
                        ? {
                              ...product,
                              isFeatured: response.data.data.isFeatured,
                          }
                        : product
                ),
                loading: false,
            }));
            toast.success(response.data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(
                error.response.data.error || "Failed to update product"
            );
        }
    },

    fetchProductsByCategory: async (category) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/products/category/${category}`);
            set({ products: response.data.data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch the product", loading: false });
            toast.error(
                error.response.data.error || "Failed to fetch products"
            );
        }
    },
}));

export { useProductStore };
