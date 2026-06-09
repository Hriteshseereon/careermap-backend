import { AdminDashboardRepository }
from "./adminDashboard.repository.js";

export const getDashboardData = async () => {

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const [
    counts,
    subscriptions,
    loginHistory,
    plans,
  ] = await Promise.all([

    AdminDashboardRepository.getCounts(),

    AdminDashboardRepository.getLast30DaysSubscriptions(
      startDate
    ),

    AdminDashboardRepository.getLoginHistory(
      startDate
    ),

    AdminDashboardRepository.getPlanSubscriptions(),
  ]);

  const [
    totalUsers,
    totalMentors,
    totalPlans,
    totalInstitutions,
    totalQuizzes,
  ] = counts;

  // Subscription chart
  const subscriptionReport = {};

  subscriptions.forEach((sub) => {

    const date =
      sub.createdAt
        .toISOString()
        .split("T")[0];

    subscriptionReport[date] =
      (subscriptionReport[date] || 0) + 1;
  });

  // Login chart
  const loginChart = {};

  loginHistory.forEach((log) => {

    const date =
      log.loginAt
        .toISOString()
        .split("T")[0];

    loginChart[date] =
      (loginChart[date] || 0) + 1;
  });

  // Pie chart
  const totalSubscriptions =
    plans.reduce(
      (sum, p) =>
        sum + p.subscriptions.length,
      0
    );

  const planDistribution =
    plans.map((plan) => ({

      planId: plan.id,

      planName: plan.name,

      subscribers:
        plan.subscriptions.length,

      percentage:
        totalSubscriptions === 0
          ? 0
          : Number(
              (
                (plan.subscriptions.length /
                  totalSubscriptions) *
                100
              ).toFixed(2)
            ),
    }));

  return {
    success: true,

    data: {

      totalUsers,

      totalMentors,

      totalPlans,

      totalInstitutions,

      totalQuizzes,

      subscriptionReport,

      loginHistory: loginChart,

      planDistribution,
    },
  };
};