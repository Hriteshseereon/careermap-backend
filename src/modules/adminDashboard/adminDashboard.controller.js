import {
  getDashboardData,
} from "./adminDashboard.service.js";

export const getDashboardController =
async (req, res) => {

  try {

    const result =
      await getDashboardData();

    res.status(200).json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};