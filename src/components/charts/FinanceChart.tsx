"use client";

import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type FinanceData = {
  name: string;
  income: number;
  expense: number;
}

interface FinanceChartProps {
  data: FinanceData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            style={{ color: entry.color }}
            className="flex items-center justify-between gap-2"
          >
            <span>{entry.name}:</span>
            <span className="font-semibold">
              ৳{entry.value.toLocaleString()}
            </span>
          </p>
        ))}
        <p className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
          <span>Net: </span>
          <span className={`font-semibold ${
            payload[0].value - payload[1].value >= 0 
            ? 'text-green-500' 
            : 'text-red-500'
          }`}>
            ৳{(payload[0].value - payload[1].value).toLocaleString()}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const FinanceChart = ({ data }: FinanceChartProps) => {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Finance</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monthly Income vs Expense
          </p>
        </div>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={20}
            tickFormatter={(value) => `৳${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "20px" }}
          />
          <Bar 
            dataKey="income" 
            fill="#27B6E9"
            barSize={16} 
            radius={[10, 10, 0, 0]}
            fillOpacity={0.9}
            strokeWidth={1}
            stroke="#1a90bc"
            name="Income"
          />
          <Bar 
            dataKey="expense" 
            fill="#A09EF5"
            barSize={16} 
            radius={[10, 10, 0, 0]}
            fillOpacity={0.9} 
            strokeWidth={1}
            stroke="#8280c4"
            name="Expense"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
