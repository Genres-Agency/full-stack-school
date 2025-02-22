"use server";

import { revalidatePath } from "next/cache";
import { AssignmentSchema } from "./formValidationSchemas";
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean };

export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  try {
    await prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        subject: { connect: data.subject ? [{ id: parseInt(data.subject) }] : [] },
        class: { connect: data.class ? [{ id: parseInt(data.class) }] : [] },
        teacher: { connect: data.teacher ? [{ id: data.teacher }] : [] }, // Ensure this is included if needed
      },
    });


    // revalidatePath('/path/to/assignments'); // Adjust the path as needed
    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating assignment:", err);
    return { success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  try {
    await prisma.assignment.update({
      where: {
        id: data.id, // Ensure `id` is part of your AssignmentSchema
      },
      data: {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        subject: {
          connect: data.subject ? [{ id: parseInt(data.subject) }] : [],
        },
        class: { connect: data.class ? [{ id: parseInt(data.class) }] : [] },
        teacher: { connect: data.teacher ? [{ id: data.teacher }] : [] }, // Ensure this is included if needed



      },
    });

    // revalidatePath('/path/to/assignments'); // Adjust the path as needed
    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating assignment:", err);
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return { success: false, error: true };
    }

    await prisma.assignment.delete({
      where: {
        id: Number(id), // Convert ID to a number
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting assignment:", err);
    return { success: false, error: true };
  }
};
