import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCartPage = () => {
    return (
        <motion.div
            className="flex flex-col items-center justify-center space-y-4 py-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <ShoppingCart className="h-24 w-24 text-purple-200" />
            <h3 className="text-2xl font-semibold">Your Cart Is Empty</h3>
            <p className="text-gray-400">
                Looks Like you haven't added anything in your cart yet.
            </p>
            <Link
                className="mt-4 rounded-md bg-purple-500 px-6 py-2 text-white transition-colors hover:bg-purple-600"
                to={"/"}
            >
                Start Shopping
            </Link>
        </motion.div>
    );
};

export default EmptyCartPage;
