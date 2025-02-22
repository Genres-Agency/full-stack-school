"use server"

import { PrismaClient } from "@prisma/client";
import prisma from "./prisma";
import { onlinePayment, OnlinePayment } from "../schema/formValidationSchemas";

type CurrentState = { success: boolean; error: boolean };

type OnlinePaymentActionResponse = {
  success: boolean;
  payment?: any;
  error?: string;
};

export const createOnlinePayment = async (
  data: OnlinePayment,
  currentState: CurrentState
): Promise<OnlinePaymentActionResponse> => {
  try {
    const payment = await prisma.onlinePayment.create({
      data: {
        transactionId: data.transactionId,
        amount: data.amount,
        status: data.status,
        student: { connect: { id: data.studentId } },
      },
    });
    return { success: true, payment };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create online payment." };
  }
};

export const updateOnlinePayment = async (
  id: string,
  data: OnlinePayment,
  currentState: CurrentState
): Promise<OnlinePaymentActionResponse> => {
  try {
    const payment = await prisma.onlinePayment.update({
      where: { id },
      data: {
        transactionId: data.transactionId,
        amount: data.amount,
        status: data.status,
        student: { connect: { id: data.studentId } },
      },
    });
    return { success: true, payment };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update online payment." };
  }
};

export const deleteOnlinePayment = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;

  try {
    await prisma.onlinePayment.delete({
      where: { id },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
