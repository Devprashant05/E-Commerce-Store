import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized Request");
        }

        try {
            const decodedToken = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET
            );
            const user = await User.findById(decodedToken.userId).select(
                "-password"
            );

            if (!user) {
                throw new ApiError(404, "User Not Found");
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new ApiError(401, "Unauthorized - Access Token Expired");
            }
            throw error;
        }
    } catch (error) {
        throw new ApiError(500, error.message || "Invalid access token");
    }
});

const adminRoute = asyncHandler(async (req, _, next) => {
    if (req.user && req.user?.role === "admin") {
        next();
    } else {
        throw new ApiError(403, "Access Denied - Admin only!");
    }
});

export { verifyJWT, adminRoute };
