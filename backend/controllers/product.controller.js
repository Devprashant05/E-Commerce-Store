import { isValidObjectId } from "mongoose";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { redis } from "../utils/redis.js";

const updateFeaturedProductCache = async () => {
    try {
        const featuredProducts = await Product.find({
            isFeatured: true,
        }).lean();
        await redis.set("featured_products", JSON.parse(featuredProducts));
    } catch (error) {
        throw new ApiError(500, "Error while updating the cache");
    }
};

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});

    if (!products) {
        throw new ApiError(400, "No Products. Pleas Add Some");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, products, "All products fetched successfully")
        );
});

const getFeaturedProduct = asyncHandler(async (req, res) => {
    let featuredProducts = await redis.get("featured_products");

    if (featuredProducts) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    JSON.parse(featuredProducts),
                    "Featured Products fetched successfully from redis"
                )
            );
    }

    // .lean() is gonna return a plain js object instead of a mongodb document which is good for performance
    featuredProducts = await Product.find({
        isFeatured: true,
    }).lean();

    if (!featuredProducts) {
        throw new ApiError(404, "No Featured Products Found");
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts));

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                featuredProducts,
                "Featured Products Fetched Successfully"
            )
        );
});

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, quantityInStock, isFeatured } =
        req.body;
    const imageLocalPath = req.file?.path;

    if (
        [name, description, price, category, quantityInStock].some(
            (field) => field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All Fields are required");
    }

    if (!imageLocalPath) {
        throw new ApiError(400, "Product image is required");
    }

    const cloudinaryResponse = await uploadOnCloudinary(imageLocalPath);

    if (!cloudinaryResponse.url) {
        throw new ApiError(400, "Error while uploading image on cloudinary");
    }

    const product = await Product.create({
        name,
        description,
        price,
        image: cloudinaryResponse.url,
        category,
        quantityInStock,
    });

    if (!product) {
        throw new ApiError(500, "Something went wrong while creating product");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product created successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Invalid product id or product not found!");
    }

    const imagePublicId = product.image.split("/").pop().split(".")[0];
    await deleteFromCloudinary(`Products/${imagePublicId}`, "image");

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
        throw new ApiError(500, "Something went wrong while deleting product");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedProduct, "Product deleted successfully")
        );
});

const getRecommendedProduct = asyncHandler(async (req, res) => {
    const products = await Product.aggregate([
        {
            $sample: { size: 3 },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                image: 1,
                description: 1,
                price: 1,
            },
        },
    ]);

    if (!products) {
        throw new ApiError(404, "No Products or Product not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                products,
                "Recommended Products fetched successfully"
            )
        );
});

const getProductByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;

    const products = await Product.find({ category });

    if (!products) {
        throw new ApiError(404, "No product found for this category");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                products,
                "Product by category fetched successfully"
            )
        );
});

const toggleFeaturedProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
        throw new ApiError(404, "Invalid product id or product not found");
    }

    const product = await Product.findById(productId);

    if (product) {
        product.isFeatured = !product.isFeatured;
        const updatedProduct = await product.save();

        //update the redis
        await updateFeaturedProductCache();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedProduct,
                    "Product isFeatured Updated successfully"
                )
            );
    } else {
        throw new ApiError(404, "Product not found");
    }
});

export {
    getAllProducts,
    getFeaturedProduct,
    createProduct,
    deleteProduct,
    getRecommendedProduct,
    getProductByCategory,
    toggleFeaturedProduct,
};
