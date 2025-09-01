import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../utils/redis.js";
import { isValidObjectId } from "mongoose";

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "10d",
        }
    );

    return { accessToken, refreshToken };
};

const storeRefreshToken = async (refreshToken, userID) => {
    await redis.set(
        `refresh_token:${userID}`,
        refreshToken,
        "EX",
        10 * 24 * 60 * 60
    );
};

const accessOptions = {
    httpOnly: true, //prevent XSS attacks, cross-site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF attack, cross-site request forgery
    maxAge: 15 * 60 * 1000, // 15m
};

const refreshOptions = {
    httpOnly: true, //prevent XSS attacks, cross-site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF attack, cross-site request forgery
    maxAge: 10 * 24 * 60 * 60 * 1000, //10d
};

const signupUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All field are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(
            401,
            "User already exist with this email. Please Login!"
        );
    }

    try {
        const createdUser = await User.create({
            username,
            email,
            password,
        });

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while creating user");
        }

        const { accessToken, refreshToken } = generateToken(createdUser._id);
        await storeRefreshToken(refreshToken, createdUser._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, accessOptions)
            .cookie("refreshToken", refreshToken, refreshOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: {
                            _id: createdUser._id,
                            username: createdUser.username,
                            email: createdUser.email,
                            role: createdUser.role,
                        },
                    },
                    "User Created Successfully"
                )
            );
    } catch (error) {
        // res.status(500).json({ message: error.message }); // this gives me proper message
        res.status(500).json(new ApiError(500, error.message)); // this doesn't show any message
        // throw new ApiError(500, error.message);
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        throw new ApiError(404, "User not registered. Please Signup!");
    }

    const isPasswordValid = await existingUser.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Password Incorrect. Please try again");
    }

    const { accessToken, refreshToken } = generateToken(existingUser._id);
    await storeRefreshToken(refreshToken, existingUser._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessOptions)
        .cookie("refreshToken", refreshToken, refreshOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: {
                        _id: existingUser._id,
                        username: existingUser.username,
                        email: existingUser.email,
                        role: existingUser.role,
                    },
                },
                "User Logged In Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(404, "Invalid UserId or User not found");
    }

    await redis.del(`refresh_token:${userId}`);

    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, {}, "User logged Out successfully"));
});

//refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(404, "No Token Found");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const storedToken = await redis.get(
            `refresh_token:${decodedToken.userId}`
        );

        if (storedToken !== incomingRefreshToken) {
            throw new ApiError(403, "Invalid Request");
        } else {
            const newAccessToken = jwt.sign(
                { userId: decodedToken.userId },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            return res
                .status(200)
                .cookie("accessToken", newAccessToken, accessOptions)
                .json(
                    new ApiResponse(
                        200,
                        {},
                        "Access Token Refreshed Successfully"
                    )
                );
        }
    } catch (error) {
        throw new ApiError(
            500,
            error.message ||
                "Something went wrong while refreshing access Token"
        );
    }
});

// Check later
const getUserProfile = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(
            500,
            "Something went wrong while geting user profile"
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User Profile fetched successfully"));
});

export {
    signupUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getUserProfile,
};
