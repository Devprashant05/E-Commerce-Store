import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { redis } from "../utils/redis.js";

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

export { getAllProducts, getFeaturedProduct };
