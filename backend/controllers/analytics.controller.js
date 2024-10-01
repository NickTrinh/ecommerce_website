import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js"

export const getAnalyticsData = async() => {
    const totalUser = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null, // groups all documents together
                totalSales: {$sum:1},  // counts num of orders in database, sum of entire document, 1 = true
                totalRevenue: {$sum:"$totalAmount"}
            }
        }
    ])

    const {totalSales, totalRevenue} = salesData[0] || {totalSales: 0, totalRevenue:0};

    return {
        users: totalUsers, 
        products:totalProducts,
        totalSales,
        totalRevenue,
    }
}

export const getDailySalesData = async (startDate, endDate) => {
    try {
        const dailySalesData = await Order.aggregate([ // returns all objects/data of an entire list in an array
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {  // get id, sales, revenue for each of the 7 days
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // get the dates and put that in an array
        const dateArray = getDatesInRange(startDate, endDate);

        // aggregated result of data
        return dateArray.map((date) => {
            // if equal to current date, we have found the item
            const foundData = dailySalesData.find((item) => item._id === date);

            return {
                date,
                sales: foundData?.sales || 0,
                revenue: foundData?.revenue || 0,
            };
        });
    } catch (error) {
        throw error;
    }
};