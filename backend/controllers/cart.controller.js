import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Product from "../models/product.model.js";

const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = req.user;
    // console.log(user);
    try {
        const existingItem = user.cartItem.find(
            (item) => item.id === productId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItem.push(productId);
        }

        await user.save();
        // console.log(updatedCart);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    user.cartItem,
                    "Item added to cart successfully"
                )
            );
    } catch (error) {
        throw new ApiError(
            500,
            error.message,
            user || "Something went wrong while add item to cart"
        );
    }
});

const getCartProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({
            _id: { $in: req.user?.cartItem },
        });

        // add quantity for each product
        const cartItems = products.map((product) => {
            const item = req.user.cartItem.find(
                (cartItem) => cartItem.id === product.id
            );
            return { ...product.toJSON(), quantity: item.quantity };
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    cartItems,
                    "Cart Items fetched successfully"
                )
            );
    } catch (error) {
        throw new ApiError(
            500,
            error.message || "Something went wrong while getting cart products"
        );
    }
});

const removeAllFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = req.user;
    console.log(productId);

    try {
        if (!productId) {
            user.cartItem = [];
        } else {
            user.cartItem = user.cartItem.filter(
                (item) => item.id !== productId
            );
        }

        const updatedCart = await user.save();
        console.log(updatedCart);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    user.cartItem,
                    "Item removed from cart successfully"
                )
            );
    } catch (error) {
        throw new ApiError(
            500,
            error.message ||
                "Something went wrong while removing item from cart"
        );
    }
});

const updateQuantity = asyncHandler(async (req, res) => {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user.cartItem.find((item) => item.id === productId);

    try {
        if (existingItem) {
            if (quantity === 0) {
                user.cartItem = user.cartItem.filter(
                    (item) => item.id !== productId
                );
                await user.save();
                return res
                    .status(200)
                    .json(
                        new ApiResponse(
                            200,
                            user.cartItem,
                            "Quantity updated successfully"
                        )
                    );
            }
            existingItem.quantity = quantity;
            await user.save();
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        user.cartItem,
                        "Quantity updated successfully"
                    )
                );
        } else {
            throw new ApiError(404, "Product not found");
        }
    } catch (error) {
        throw new ApiError(
            500,
            error.message || "Something went wrong whle updating quantity"
        );
    }
});

export { addToCart, getCartProducts, removeAllFromCart, updateQuantity };
