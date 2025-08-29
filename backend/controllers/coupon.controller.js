import Coupon from "../models/coupon.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getCoupon = asyncHandler(async (req, res) => {
    try {
        const coupon = await Coupon.findOne({
            userId: req.user?._id,
            isActive: true,
        });

        if (!coupon) {
            throw new ApiError(404, "Coupon Not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, coupon, "Coupon Fetched successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Error while fetching coupon");
    }
});

const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
        code: code,
        userId: req.user?._id,
        isActive: true,
    });

    if (!coupon) {
        throw new ApiError(404, "Coupon Not found");
    }

    if (coupon.expirationDate < new Date()) {
        coupon.isActive = false;
        await coupon.save();
        throw new ApiError(404, "Coupon Expired");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, coupon, "Coupon verified successfully"));
});

export { getCoupon, validateCoupon };
