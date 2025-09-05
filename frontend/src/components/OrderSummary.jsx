import React from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

const OrderSummary = () => {
    const { total, subTotal, coupon, isCouponApplied } = useCartStore();
    const savings = (subTotal - total).toFixed(2);
    return (
        <motion.div
            className="space-y-4 rounded-lg border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <p className="text-xl font-semibold text-purple-400">
                Order Summary
            </p>
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-base font-normal text-gray-300">
                            Original Price
                        </p>
                        <p className="text-base font-medium text-white">
                            ${subTotal.toFixed(2)}
                        </p>
                    </div>
                    {savings > 0 && (
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-base font-normal text-gray-300">
                                Savings
                            </p>
                            <p className="text-base font-medium text-purple-400">
                                -${savings}
                            </p>
                        </div>
                    )}
                    {coupon && isCouponApplied && (
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-base font-normal text-gray-300">
                                Coupon ({coupon.code})
                            </p>
                            <p className="text-base font-medium text-purple-400">
                                -{coupon.discountPercentage}%
                            </p>
                        </div>
                    )}
                    <div className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
                        <p className="text-base font-bold text-gray-300">
                            Total
                        </p>
                        <p className="text-base font-bold text-purple-400">
                            ${total.toFixed(2)}
                        </p>
                    </div>
                </div>
                <motion.button
                    className="flex w-full items-center justify-center rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    // onClick={handleClick}
                >
                    Proceed To Checkout
                </motion.button>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-normal text-gray-400">
                        or
                    </span>
                    <Link
                        to={"/"}
                        className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 underline hover:text-purple-300 hover:no-underline"
                    >
                        Continue Shopping
                        <MoveRight size={16} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderSummary;
