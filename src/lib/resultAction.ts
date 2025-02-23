"use server";

import { revalidatePath } from "next/cache";
import {
  ResultSchema,
} from "../schema/formValidationSchemas";
import prisma from "./prisma";
import { Prisma } from "@prisma/client";

type CurrentState = { success: boolean; error: boolean };

type ResultActionResponse = {
  success: boolean;
  result?: any; // Adjust this type based on your actual result structure
  error?: string; // Use string for error messages
};
export const createResult = async (
    data: { studentId: string; subjectId: number; marks: number; grade: string }[]
  ) => {
  console.log("Function createResult called with data:", data);
  
    try {
      if (!data || data.length === 0) {
        throw new Error("No data provided for insertion.");
      }
  
      // Validate if student exists
      const studentExists = await prisma.student.findUnique({
        where: { username: data[0].studentId },
      });
  

      if (!studentExists) {
        throw new Error(`Student with ID '${data[0].studentId}' not found.`);
      }
  
      console.log("Student validation passed.");
  
      // Validate if subjects exist
      const subjectIds = data.map((entry) => entry.subjectId);
      const subjects = await prisma.subject.findMany({
        where: { id: { in: subjectIds } },
      });
  
      if (subjects.length !== subjectIds.length) {
        throw new Error("One or more subject IDs are invalid.");
      }
  
      // console.log("Subject validation passed.");
  
      // Insert data using Prisma transaction
      const results = await prisma.$transaction(
        data.map((result) =>
          prisma.result.create({
            data: {
              studentId: result.studentId,
              subjectId: result.subjectId, // Keep as number since schema expects number
              marks: result.marks,
              grade: result.grade,
            },
          })
        )
      );
  
      console.log("Inserted results:", results);
      return { success: true, results };
    } catch (error) {
      console.error("Error creating results:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Client Error:", error);
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };
  
  // Update an existing result
  export const updateResult = async (id: number, data: ResultSchema) => {
    try {
      console.log("Updating result with data:", data);
      const result = await prisma.result.update({
        where: { id: id.toString() }, // Ensure id is a string if your schema expects it
        data: {
          studentId: data.studentId,
          subjectId: data.subjects[0].subjectId, // Assuming you want to update the first subject
          marks: data.subjects[0].marks,
        },
      });
      return { success: true, result };
    } catch (error) {
      console.error("Error updating result:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };
  
  // Delete a result
  export const deleteResult = async (
    prevState: { success: boolean; error: boolean },
    formData: FormData
  ) => {
    try {
      const id = formData.get("id") as string;
  
      if (!id) {
        return { success: false, error: true };
      }
  
      await prisma.result.delete({
        where: {
          id: id, // Use the ID as a string directly
        },
      });
  
      return { success: true, error: false };
    } catch (error) {
      console.error("Error deleting result:", error);
      return { success: false, error: true };
    }
  };