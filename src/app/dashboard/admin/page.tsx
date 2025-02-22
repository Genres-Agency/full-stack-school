import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/charts/AttendanceChartContainer";
import CountChartContainer from "@/components/charts/CountChartContainer";
import EmergencyNumbers from "@/components/shared/EmergencyNumbers";
import FinanceChartContainer from "@/components/charts/FinanceChartContainer";
import UserCard from "@/components/UserCard";
import { Suspense } from "react";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/auth"

const AdminPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  // const session = await getServerSession(authOptions);
  // const user = session?.user;
  // console.log(" sadfdsa-----=====",user);

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row w-full">

      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="student" />
          {/* <UserCard type="parent" /> */}
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <Suspense fallback={
            <div className="bg-white dark:bg-[#18181b] rounded-xl w-full h-full p-4 flex items-center justify-center">
              <p>Loading finance data...</p>
            </div>
          }>
            <FinanceChartContainer />
          </Suspense>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col">
        <Announcements />
        <EmergencyNumbers />
        {/* <EventCalendarContainer searchParams={searchParams}/> */}
      </div>
    </div>
  );
};

export default AdminPage;
