"use server";

import { revalidatePath } from "next/cache";
import {
    AdmissionSchema,
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

export const createAdmission = async (data: AdmissionSchema) => {
    try {
      await prisma.admission.create({
        data,
      });
      return { success: true, error: false };
    } catch (err) {
      console.error("Error creating admission:", err);
      return { success: false, error: true };
    }
  };
  
  export const updateAdmission = async (
    id: number,
    data: Partial<AdmissionSchema>
  ) => {
    try {
      await prisma.admission.update({
        where: { id },
        data,
      });
      return { success: true, error: false };
    } catch (err) {
      console.error("Error updating admission:", err);
      return { success: false, error: true };
    }
  };
  
  export const deleteAdmission = async (
    prevState: { success: boolean; error: boolean },
    formData: FormData
  ) => {
    try {
      const id = formData.get('id') as string;
      await prisma.admission.delete({
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