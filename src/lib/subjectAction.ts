"use server";

import { revalidatePath } from "next/cache";
import {
  SubjectSchema,
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

export const createSubject = async (
    currentState: CurrentState,
    data: SubjectSchema
  
  ) => {
    // console.log(data);
    try {
      await prisma.subject.create({
        data: {
          id: data.id,
          name: data.name,
        
        },
      });
  
      // revalidatePath("/list/subjects");
      return { success: true, error: false };
    } catch (err) {
      console.log(err);
      return { success: false, error: true };
    }
  };
  
  export const updateSubject = async (
    currentState: CurrentState,
    data: SubjectSchema
  ) => {
    try {
      await prisma.subject.update({
        where: {
          id: data.id,
        },
        data: {
          id: data.id,
          name: data.name,
      
        },
      });
  
      // revalidatePath("/list/subjects");
      return { success: true, error: false };
    } catch (err) {
      console.log(err);
      return { success: false, error: true };
    }
  };
  
  export const deleteSubject = async (
    currentState: CurrentState,
    data: FormData
  ) => {
    const id = data.get("id") as string;
    try {
      await prisma.subject.delete({
        where: {
          id: parseInt(id),
        },
      });
  
      // revalidatePath("/list/subjects");
      return { success: true, error: false };
    } catch (err) {
      console.log(err);
      return { success: false, error: true };
    }
  };