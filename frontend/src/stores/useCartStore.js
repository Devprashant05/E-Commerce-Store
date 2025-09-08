import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { data } from "react-router-dom";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subTotal: 0,
    loading: false,
    isCouponApplied: false,

    getMyCoupon: async () => {
        try {
            const response = await axios.get("/coupons");
            console.log(response.data);
            set({ coupon: response.data.data });
        } catch (error) {
            console.error("Error fetching coupon", error);
        }
    },

    applyCoupon: async (code) => {
        try {
            console.log("code", code);

            const response = await axios.post("/coupons/validate", { code });
            console.log("validate resp", response.data);
            set({ coupon: response.data.data, isCouponApplied: true });
            get().calculateTotal();
            toast.success("Coupon Applied Successfully");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to apply coupon"
            );
        }
    },

    removeCoupon: () => {
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotal();
        toast.success("Coupon removed");
    },

    getCartItems: async () => {
        try {
            const result = await axios.get("/cart");
            set({ cart: result.data.data });
            get().calculateTotal();
        } catch (error) {
            set({ cart: [] });
            toast.error(error.response.data.message || "An error occured");
        }
    },

    clearCart: async () => {
        set({ cart: [], coupon: null, total: 0, subTotal: 0 });
    },

    addToCart: async (product) => {
        try {
            await axios.post("/cart", { productId: product._id });
            toast.success("Product added to cart");

            set((prevState) => {
                const existingItem = prevState.cart.find(
                    (item) => item._id === product._id
                );
                console.log("existing item", existingItem);

                const newCart = existingItem
                    ? prevState.cart.map((item) =>
                          item._id === product._id
                              ? { ...item, quantity: item.quantity + 1 }
                              : item
                      )
                    : [...prevState.cart, { ...product, quantity: 1 }];
                console.log("new cart", newCart);
                return { cart: newCart };
            });
            get().calculateTotal();
        } catch (error) {
            toast.error(error.response.data.message || "An error occured");
        }
    },

    removeFromCart: async (productId) => {
        console.log(productId);
        const response = await axios.delete("/cart", { data: { productId } });
        set((prevState) => ({
            cart: prevState.cart.filter((item) => item._id !== productId),
        }));
        get().calculateTotal();
        toast.success(response.data.message);
    },

    updateQuantity: async (productId, quantity) => {
        if (quantity === 0) {
            get().removeFromCart(productId);
            return;
        }
        await axios.put(`/cart/${productId}`, { quantity });
        set((prevState) => ({
            cart: prevState.cart.map((item) =>
                item._id === productId ? { ...item, quantity } : item
            ),
        }));
        get().calculateTotal();
    },

    calculateTotal: () => {
        const { cart, coupon } = get();
        const subTotal = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        let total = subTotal;
        if (coupon) {
            const discount = subTotal * (coupon.discountPercentage / 100);
            total = subTotal - discount;
        }
        set({ subTotal, total });
    },

    

}));
