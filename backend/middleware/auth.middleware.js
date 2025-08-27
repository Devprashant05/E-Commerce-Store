import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.refreshToken ||
            req.header("authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(403, "Unauthorized Request");
        }

        const decodedToken = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        );
        const userId = decodedToken?.userId;

        if (!userId) {
            throw new ApiError(404, "UserId Not Found");
        }

        req.user = userId;
        next();
    } catch (error) {
        throw new ApiError(500, error.message || "Invalid access token");
    }
});

export { verifyJWT };
