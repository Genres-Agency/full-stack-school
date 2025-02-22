"use server";

import { revalidatePath } from "next/cache";
import {
  AttendanceSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
// import { clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

type CurrentState = { success: boolean; error: boolean };

type ResultActionResponse = {
  success: boolean;
  result?: any; // Adjust this type based on your actual result structure
  error?: string; // Use string for error messages
};

export const createAttendance = async (data: AttendanceSchema) => {
    try {
      const attendance = await prisma.attendance.create({
        data: {
          classId: data.classId,
          date: new Date(data.date), // Ensure valid Date object
          day: data.day,
          present: data.present,
          total: data.total,
        },
        include: {
          classes: true, // Include subject
      },
      });
      return { success: true, attendance };
    } catch (error) {
      console.error("Error creating attendance:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  };
  
  export const updateAttendance = async (id: number, data: AttendanceSchema) => {
    try {
      const attendance = await prisma.attendance.update({
        where: { id },
        data: {
          classId: data.classId,
          date: new Date(data.date),
          day: data.day,
          present: data.present,
          total: data.total,
        },
      });
      console.log("Updated Attendance:", attendance);
      return { success: true, attendance };
    } catch (error) {
      console.error("Error updating attendance:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  };
  
  export const deleteAttendance = async (
    prevState: { success: boolean; error: boolean },
    formData: FormData
  ) => {
    try {
      const id = formData.get("id") as string;
  
      if (!id) {
        return { success: false, error: true };
      }
  
      await prisma.attendance.delete({
        where: {
          id: Number(id), // Convert ID to a number
        },
      });
  
      return { success: true, error: false };
    } catch (err) {
      console.error("Error deleting attendance:", err);
      return { success: false, error: true };
    }
  };
  