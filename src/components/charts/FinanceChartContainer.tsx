import prisma from "@/lib/prisma";
import FinanceChart from "./FinanceChart";

const FinanceChartContainer = async () => {
  try {
    // Get current year
    const currentYear = new Date().getFullYear();

    // Fetch finance records for each month of the current year
    const financeRecords = await prisma.finance.findMany({
      where: {
        createdAt: {
          gte: new Date(currentYear, 0, 1), // Start of current year
          lt: new Date(currentYear + 1, 0, 1), // Start of next year
        },
      },
      select: {
        amount: true,
        type: true, // Assuming you have a 'type' field to distinguish income/expense
        createdAt: true,
      },
    });

    // console.log("Finance Records:", financeRecords); // Debug log

    // Initialize monthly data with all months
    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
      name: new Date(currentYear, index).toLocaleString('default', { month: 'short' }),
      income: 0,
      expense: 0,
    }));

    // Calculate monthly totals
    financeRecords.forEach((record) => {
      const month = record.createdAt.getMonth();
      const amount = Number(record.amount); // Ensure amount is a number

      if (record.type === 'INCOME') {
        monthlyData[month].income += amount;
      } else if (record.type === 'EXPENSE') {
        monthlyData[month].expense += amount;
      }
    });

    // console.log("Monthly Data:", monthlyData); // Debug log

    return <FinanceChart data={monthlyData} />;
  } catch (error) {
    console.error("Error in FinanceChartContainer:", error);
    // Return empty chart with message
    return (
      <div className="bg-white dark:bg-[#18181b] rounded-xl w-full h-full p-4 flex items-center justify-center">
        <p className="text-red-500">Error loading finance data</p>
      </div>
    );
  }
};

export default FinanceChartContainer; 