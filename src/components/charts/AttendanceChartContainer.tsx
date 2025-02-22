import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {
  const today = new Date();
  const lastSevenDays = new Date();
  lastSevenDays.setDate(today.getDate() - 6); // Get data from last 7 days, including today

  // Fetch attendance data for the past 7 days
  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastSevenDays,
      },
    },
    select: {
      id: true,
      date: true,
      present: true,
      total: true,
    },
  });

  // Days of the last week dynamically (Excluding Friday & Saturday)
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - (6 - i)); // Get last 7 days
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    return dayName;
  }).filter(day => day !== "Fri" && day !== "Sat"); // Exclude Fri & Sat

  // Initialize attendance map
  const attendanceMap: { [key: string]: { present: number; absent: number; total: number } } = {};
  daysOfWeek.forEach(day => {
    attendanceMap[day] = { present: 0, absent: 0, total: 0 };
  });

  // Process attendance data
  resData.forEach((item) => {
    const itemDate = new Date(item.date);
    const dayName = itemDate.toLocaleDateString("en-US", { weekday: "short" });

    if (attendanceMap[dayName]) { // Only process allowed days
      attendanceMap[dayName].present += item.present || 0;
      attendanceMap[dayName].total += item.total || 0;
    }
  });

  // Calculate absentees
  daysOfWeek.forEach(day => {
    attendanceMap[day].absent = attendanceMap[day].total - attendanceMap[day].present;
  });

  // Prepare data for the chart (ordered by last 7 days, excluding Fri & Sat)
  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <div className="bg-white dark:bg-[#18181b] rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>
      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
