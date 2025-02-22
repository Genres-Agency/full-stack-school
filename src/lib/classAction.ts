"use server";

import { revalidatePath } from "next/cache";
import {
  ClassSchema,
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

// CREATE CLASS
export const createClass = async (
    currentState: CurrentState,
    data: ClassSchema
  ) => {
    console.log("Creating class",data);
    try {
      await prisma.class.create({
        data,
        select: {
          id: true,
          name: true,
          fees: true,
          capacity: true,
          supervisorId: true,
        },
      });
  
      // revalidatePath("/list/class");
      return { success: true, error: false };
    } catch (err) {
      // console.log(err);
      return { success: false, error: true };
    }
  };
  
  export const updateClass = async (
    currentState: CurrentState,
    data: ClassSchema
  ) => {
    try {
      await prisma.class.update({
        where: {
          id: data.id,
        },
        data,
      });
  
      // revalidatePath("/list/class");
      return { success: true, error: false };
    } catch (err) {
      console.log(err);
      return { success: false, error: true };
    }
  };
  
  export const deleteClass = async (
    currentState: CurrentState,
    data: FormData
  ) => {
    const id = data.get("id") as string;
    try {
      await prisma.class.delete({
        where: {
          id: parseInt(id),
        },
      });
  
      // revalidatePath("/list/class");
      return { success: true, error: false };
    } catch (err) {
      console.log(err);
      return { success: false, error: true };
    }
  };