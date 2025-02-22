"use server";

import { revalidatePath } from "next/cache";
import { FinanceSchema } from "./formValidationSchemas";
import prisma from "./prisma";
// import { clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

type CurrentState = { success: boolean; error: boolean };

type ResultActionResponse = {
  success: boolean;
  result?: any; // Adjust this type based on your actual result structure
  error?: string; // Use string for error messages
};

export const createFinance = async (data: FinanceSchema) => {
  return await prisma.finance.create({
    data,
  });
};

export const updateFinance = async (id: number, data: FinanceSchema) => {
  return await prisma.finance.update({
    where: { id },

    data,
  });
};

export const deleteFinance = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;

  try {
    await prisma.finance.delete({
      where: { id: parseInt(id) },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
