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
  ReferenceLine,
} from "recharts";

type FinanceData = {
  name: string;
  income: number;
  expense: number;
  net?: number;
}

interface FinanceChartProps {
  data: FinanceData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const income = payload[0]?.value || 0;
    const expense = payload[1]?.value || 0;
    const net = income - expense;
    const profitMargin = income > 0 ? ((net / income) * 100).toFixed(1) : 0;

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-semibold">
              ৳{entry.value.toLocaleString()}
            </span>
          </p>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
          <p className="flex items-center justify-between gap-4 text-sm">
            <span>Net:</span>
            <span className={`font-semibold ${net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {net >= 0 ? '৳' : '-৳'}{Math.abs(net).toLocaleString()}
            </span>
          </p>
          <p className="flex items-center justify-between gap-4 text-xs text-gray-500 mt-1">
            <span>Profit Margin:</span>
            <span className={net >= 0 ? 'text-green-500' : 'text-red-500'}>
              {profitMargin}%
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const FinanceChart = ({ data }: FinanceChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={370}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" vertical={false} />
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
        <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
        <Bar
          dataKey="income"
          fill="#3b86f6"
          barSize={16}
          fillOpacity={0.9}
          name="Income"
        />
        <Bar
          dataKey="expense"
          fill="red"
          barSize={16}
          fillOpacity={0.9}
          name="Expense"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FinanceChart;
