import prisma from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
import { useEffect, useState } from "react";
import Image from "next/image";

const Announcements = async () => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;
  // console.log("hdsajhjds =====", sessionClaims);
  

  // const roleConditions = {
  //   teacher: { lessons: { some: { teacherId: userId! } } },
  //   student: { students: { some: { id: userId! } } },
  // };

  const data = await prisma.announcement.findMany({
    // take: 5,
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="bg-white dark:bg-[#18181b] p-4 rounded-md select-none">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400 cursor-pointer">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data.map((announcement) => (
          <div key={announcement.id} className="bg-lamaSkyLight dark:bg-gray-600 rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium select-none">{announcement.title}</h2>
              <span className="text-xs text-gray-400  rounded-md px-1 ">
                Start Date: {new Intl.DateTimeFormat("en-GB").format(announcement.startDate)}
              </span>
              <span className="text-xs text-gray-400  rounded-md px-1">
                End Date: {new Intl.DateTimeFormat("en-GB").format(announcement.endDate)}
              </span>
     
            </div>
           
            <p className="text-sm text-gray-400 mt-1 select-none">{announcement.description}</p>
            {announcement?.img && (
              <Image
                src={announcement.img}
                alt={announcement.title}
                width={100}
                height={100}
                className="rounded-md mt-2"
              />
            )}
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default Announcements;
