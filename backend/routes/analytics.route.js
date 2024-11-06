import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData } from "../controllers/analytics.controller.js";
import { getDailySalesData } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData();

        // Get current date at the start of the day
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);  // End of current day

        // Get date 6 days ago at the start of the day
        const startDate = new Date();
        startDate.setDate(startDate.getDate()-7);
        startDate.setHours(0, 0, 0, 0);  // Start of day

        const dailySalesData = await getDailySalesData(startDate, endDate);

        res.json({
            analyticsData,
            dailySalesData,
        });
    } catch (error) {
        console.log("Error in analytics route", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;