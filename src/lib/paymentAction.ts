"use server"
import { PrismaClient } from "@prisma/client";
import { PaymentSchema } from "../schema/formValidationSchemas";
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean };

type PaymentActionResponse = {
  success: boolean;
  payment?: any;
  error?: string;
};

export const createPayment = async (
  data: PaymentSchema,
  currentState: CurrentState
): Promise<PaymentActionResponse> => {
  try {
    const payment = await prisma.payment.create({
      data: {
        id: data.id,
        amount: data.amount,
        status: data.status,
        student: { connect: { username: data.studentId } },
      },
    });
    return { success: true, payment };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create payment." };
  }
};

export const updatePayment = async (
  id: string,
  data: PaymentSchema,
  currentState: CurrentState
): Promise<PaymentActionResponse> => {
  try {
    const payment = await prisma.payment.update({
      where: { id },
      data: {
        amount: data.amount,
        status: data.status,
        student: { connect: { username: data.studentId } },
      },
    });
    return { success: true, payment };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update payment." };
  }
};

export const deletePayment = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;

  try {
    await prisma.payment.delete({
      where: { id },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};