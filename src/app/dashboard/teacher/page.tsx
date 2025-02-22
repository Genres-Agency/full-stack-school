import { authOptions } from "@/auth";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EmergencyNumbers from "@/components/shared/EmergencyNumbers";
import { getServerSession } from "next-auth";

const TeacherPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.username;
  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-fit bg-white dark:bg-[#18181b] p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalendarContainer type="teacherId" id={userId!} />
        </div>

      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
        <EmergencyNumbers/>
      </div>
    </div>
  );
};

export default TeacherPage;
