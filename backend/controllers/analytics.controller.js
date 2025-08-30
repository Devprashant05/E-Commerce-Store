import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAnalyticsData = async () => {
    const totalUser = await User.countDocuments();
    const totalProduct = await Product.countDocuments();

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null, // it groups all document together
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" },
            },
        },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || {
        totalSales: 0,
        totalRevenue: 0,
    };

    return {
        user: totalUser,
        products: totalProduct,
        totalSales,
        totalRevenue,
    };
};

const getDailySalesData = async (startDate, endDate) => {
    const dailySalesData = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                sales: { $sum: 1 },
                revenue: { $sum: "$totalAmount" },
            },
        },
        {
            $sort: {
                _id: 1,
            },
        },
    ]);

    const dateArray = getDatesInRange(startDate, endDate);

    return dateArray.map((date) => {
        const foundData = dailySalesData.find((item) => item._id === date);

        return {
            date,
            sales: foundData?.sales || 0,
            revenue: foundData?.revenue,
        };
    });

    // example output of the daily sales data
    // [
    //     {
    //         _id: "2025-04-10",
    //         sales: 12,
    //         revenue: 1459.09
    //     }
    // ]
};

function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

const getAnalyticsStats = asyncHandler(async (req, res) => {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);

    if (!dailySalesData && !analyticsData) {
        throw new ApiError(
            500,
            "Something went wrong while getting analytics data"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { analyticsData, dailySalesData },
                "Analytics and Sales data fetched successfully"
            )
        );
});

export { getAnalyticsStats };
