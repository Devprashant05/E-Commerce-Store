import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, Check } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = [
    "jean",
    "t-shirt",
    "shoe",
    "glasses",
    "jacket",
    "suit",
    "bag",
];

const CreateProduct = () => {
    const { createProduct, loading } = useProductStore();
    // const loading = false;
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        productImage: "",
    });

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            /**
             * So whenever file uploads through multer or in general converts into form data
             * file render increase the size by 33% and server needs to decode base64 and that not efficient for large files
             */

            // formdata Object
            const formData = new FormData();
            formData.append("name", newProduct.name);
            formData.append("description", newProduct.description);
            formData.append("price", newProduct.price);
            formData.append("category", newProduct.category);
            formData.append("productImage", newProduct.productImage);

            await createProduct(formData);
            setNewProduct({
                name: "",
                description: "",
                price: "",
                category: "",
                image: "",
            });
        } catch (error) {
            console.log("error creating a product", error);
        }
        console.log(newProduct);
    };

    // 2nd way to handle files
    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setNewProduct({ ...newProduct, image: reader.result });
    //         };
    //         reader.readAsDataURL(file); //this conver the file into base64 format
    //     }
    // };

    return (
        <motion.div
            className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="text-2xl font-semibold mb-6 text-purple-200">
                Create New Product
            </h2>

            <form onSubmit={submitHandler} className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300"
                    >
                        Product Name
                    </label>
                    <input
                        type="text"
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        name="name"
                        id="name"
                        placeholder="Enter Product Name"
                        value={newProduct.name}
                        onChange={(e) =>
                            setNewProduct({
                                ...newProduct,
                                name: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-300"
                    >
                        Product Description
                    </label>
                    <textarea
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        name="description"
                        id="description"
                        placeholder="Enter Product Description"
                        rows={3}
                        value={newProduct.description}
                        onChange={(e) =>
                            setNewProduct({
                                ...newProduct,
                                description: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-300"
                    >
                        Product Price
                    </label>
                    <input
                        type="number"
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        name="price"
                        id="price"
                        placeholder="Enter Product Price"
                        step={0.01}
                        value={newProduct.price}
                        onChange={(e) =>
                            setNewProduct({
                                ...newProduct,
                                price: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-300"
                    >
                        Product Category
                    </label>
                    <select
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        name="category"
                        id="category"
                        step={0.01}
                        value={newProduct.category}
                        onChange={(e) =>
                            setNewProduct({
                                ...newProduct,
                                category: e.target.value,
                            })
                        }
                        required
                    >
                        <option value="">Select a Category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category.toLocaleUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center">
                    <input
                        type="file"
                        name="image"
                        id="image"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                            const productImage = e.target.files[0];
                            console.log(productImage);

                            if (productImage) {
                                setNewProduct({
                                    ...newProduct,
                                    productImage: productImage,
                                });
                            }
                        }}
                    />
                    <label
                        htmlFor="image"
                        className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 "
                    >
                        <Upload className="h-5 w-5 inline-block mr-2" />
                        Upload Image
                    </label>
                    {newProduct.productImage && (
                        <span className="ml-3 text-sm text-gray-400 flex items-center">
                            Image Uploaded{" "}
                            <Check className="ml-2 h-4 w-4 text-green-500" />
                        </span>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className="mr-2 h-5 w-5 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Create Product
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default CreateProduct;
