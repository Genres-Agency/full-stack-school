import prisma from "@/lib/prisma";
import FinanceChart from "./FinanceChart";
import Image from "next/image";

const FinanceChartContainer = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const financeRecords = await prisma.finance.findMany({
      where: {
        createdAt: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1),
        },
      },
      select: {
        amount: true,
        type: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });



    // Calculate yearly totals
    const yearlyStats = financeRecords.reduce((acc, record) => {
      const amount = Number(record.amount);
      const type = record.type.toUpperCase(); // Normalize case

      if (type === 'INCOME') {
        acc.totalIncome += amount;
      } else if (type === 'EXPENSE') {
        acc.totalExpense += amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpense: 0 });

    const netIncome = yearlyStats.totalIncome - yearlyStats.totalExpense;


    // Initialize and calculate monthly data
    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
      name: new Date(currentYear, index).toLocaleString('default', { month: 'short' }),
      income: 0,
      expense: 0,
      net: 0,
    }));



    financeRecords.forEach((record) => {
      const createdAtDate = new Date(record.createdAt); // Ensure it's a Date object
      const month = createdAtDate.getMonth(); // Get month index (0-based)
      const amount = Number(record.amount);
      const type = record.type.toUpperCase(); // Normalize type to uppercase

      if (type === 'INCOME') {
        monthlyData[month].income += amount;
      } else if (type === 'EXPENSE') {
        monthlyData[month].expense += amount;
      }
      monthlyData[month].net = monthlyData[month].income - monthlyData[month].expense;
    });



    // Calculate current month stats
    const currentMonthStats = monthlyData[currentMonth];
    const currentMonthGrowth = currentMonth > 0
      ? ((currentMonthStats.net - monthlyData[currentMonth - 1].net) / Math.abs(monthlyData[currentMonth - 1].net || 1) * 100).toFixed(1)
      : 0;



    return (
      <div className="bg-white dark:bg-[#18181b] rounded-xl w-full h-full p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-lg font-semibold">Financial Overview</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monthly Income vs Expense ({currentYear})
            </p>
            <div className="mt-2 grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Income</p>
                <p className="font-semibold text-blue-500">
                  ৳{yearlyStats.totalIncome.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Total Expense</p>
                <p className="font-semibold text-purple-500">
                  ৳{yearlyStats.totalExpense.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Net Income</p>
                <p className={`font-semibold ${netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {netIncome >= 0 ? '৳' : '-৳'}{Math.abs(netIncome).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Monthly Growth</p>
                <p className={`font-semibold ${Number(currentMonthGrowth) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {currentMonthGrowth}%
                </p>
              </div>
            </div>
          </div>
          <Image src="/moreDark.png" alt="More options" width={20} height={20} />
        </div>
        <FinanceChart data={monthlyData} />
      </div>
    );
  } catch (error) {
    console.error("Error in FinanceChartContainer:", error);
    return (
      <div className="bg-white dark:bg-[#18181b] rounded-xl w-full h-full p-4 flex items-center justify-center">
        <p className="text-red-500">Error loading finance data</p>
      </div>
    );
  }
};

export default FinanceChartContainer;