"use server";

import { revalidatePath } from "next/cache";
import { ExamRoutineSchema } from "../schema/formValidationSchemas";
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean };

// Create Exam Routine
// export const createExamRoutine = async (
//   currentState: CurrentState,
//   data: ExamRoutineSchema
// ) => {
//   try {
//     await prisma.examRoutine.create({
//       data: {
//         classId: data.classId,
//         subjectId: data.subjectId,
//         date: data.examDate,
//         title: data.title,
//       },
//     });

//     revalidatePath("/exam-routine"); // Adjust the path as needed
//     return { success: true, error: false };
//   } catch (err) {
//     console.error(err);
//     return { success: false, error: true };
//   }
// };
export const createExamRoutine = async (
  currentState: CurrentState,
  data: ExamRoutineSchema
) => {
  try {
      await prisma.examRoutine.create({
          data: {
              title: data.title,
              startTime: data.startTime,
              classId: data.classId,
              subjectId: data.subjectId, // Added subjectId
          },
          include: {
              classes: true,
              subject: true, // Include subject
          },
      });

      return { success: true, error: false };
  } catch (err) {
      console.log(err);
      return { success: false, error: true };
  }
};

export const updateExamRoutine = async (
  currentState: CurrentState,
  data: ExamRoutineSchema
) => {
  try {
      await prisma.examRoutine.update({
          where: {
              id: data.id,
          },
          data: {
              title: data.title,
              startTime: data.startTime,
              classId: data.classId,
              subjectId: data.subjectId, // Added subjectId
          },
      });

      return { success: true, error: false };
  } catch (err) {
      console.log(err);
      return { success: false, error: true };
  }
};

// Update Exam Routine
// export const updateExamRoutine = async (
//   currentState: CurrentState,
//   data: ExamRoutineSchema
// ) => {
//   try {
//     await prisma.examRoutine.update({
//       where: { id: data.id },
//       data: {
//         classId: data.classId,
//         subjectId: data.subjectId,
//         date: data.examDate,
//         title: data.title,
//       },
//     });

//     revalidatePath("/exam-routine");
//     return { success: true, error: false };
//   } catch (err) {
//     console.error(err);
//     return { success: false, error: true };
//   }
// };

// Delete Exam Routine
export const deleteExamRoutine = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.examRoutine.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/exam-routine");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};
