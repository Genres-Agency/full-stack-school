"use server";

import { revalidatePath } from "next/cache";
import {
  AnnouncementSchema,
} from "../schema/formValidationSchemas";
import prisma from "./prisma";
// import { clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

type CurrentState = { success: boolean; error: boolean };

type ResultActionResponse = {
  success: boolean;
  result?: any; // Adjust this type based on your actual result structure
  error?: string; // Use string for error messages
};

export const createAnnouncement = async (
    currentState: CurrentState,
    data: AnnouncementSchema
  ) => {
    try {
      // Exclude 'id' from the data object when creating a new announcement
      const { id, ...createData } = data;
  
      await prisma.announcement.create({
        data: createData,
      });
  
      // revalidatePath("/list/announcements");
      return { success: true, error: false };
    } catch (err) {
      console.log(err);
      return { success: false, error: true };
    }
  };
  
  export const updateAnnouncement = async (
    currentState: CurrentState,
    data: AnnouncementSchema
  ) => {
    try {
      await prisma.announcement.update({
        where: {
          id: Number(data.id), // Ensure id is a number
        },
        data: {
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          img: data.img,
        },
      });
  
      // revalidatePath("/list/announcements");
      return { success: true, error: false };
    } catch (err) {
      console.log(err);
      return { success: false, error: true };
    }
  };
  
  export const deleteAnnouncement = async (
    prevState: { success: boolean; error: boolean },
    formData: FormData
  ) => {
    try {
      const id = formData.get('id') as string;
      await prisma.announcement.delete({
        where: {
          id: Number(id), // Ensure id is a number
        },
      });
      return { success: true, error: false };
    } catch (err) {
      console.log(err);
      return { success: false, error: true };
    }
  };