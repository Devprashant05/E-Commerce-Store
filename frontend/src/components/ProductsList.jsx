import React from "react";
import { motion } from "framer-motion";
import { Star, Trash2Icon, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
    const { loading, deleteProduct, toggleFeaturedProduct, products } =
        useProductStore();

    console.log(products);

    return (
        <motion.div
            className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                            Product
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                            Description
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                            Price
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                            Category
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                            Featured
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {products?.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-13 w-13">
                                        <img
                                            className="h-13 w-13 rounded-full object-cover"
                                            src={product.image}
                                            alt={product.name}
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-white">
                                            {product.name}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm text-gray-300">
                                    {product.description}
                                </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm text-gray-300">
                                    {product.price.toFixed(2)}
                                </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm text-gray-300">
                                    {product.category.toUpperCase()}
                                </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    disabled={loading}
                                    onClick={() => {
                                        toggleFeaturedProduct(product._id);
                                    }}
                                    className={`p-1 rounded-full ${product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"} hover:bg-yellow-500 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {loading ? (
                                        <Loader className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Star className="h-5 w-5" />
                                    )}
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    disabled={loading}
                                    onClick={() => {
                                        deleteProduct(product._id);
                                    }}
                                    className="p-1 rounded-full bg-gray-600  text-red-400  hover:text-red-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Trash2Icon className="h-5 w-5" />
                                    )}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    );
};

export default ProductsList;
