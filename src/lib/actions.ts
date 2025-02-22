"use server";

import { revalidatePath } from "next/cache";
import {
  LessonSchema,
  ParentSchema,
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


export const createLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  try {
    await prisma.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    });

    console.log("Lesson created successfully.");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating lesson:", err); // Log the error
    return { success: false, error: true };
  }
};

export const updateLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  try {
    await prisma.lesson.update({
      where: {
        id: data.id, // Ensure `id` is part of your LessonSchema
      },
      data: {
        name: data.name,
        day: data.day,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        subjectId: data.subjectId,
        classId: data.classId, // Ensure classId is included
        teacherId: data.teacherId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  try {
    // const user = await clerkClient.users.createUser({
    //   username: data.username,
    //   password: data.password,
    //   firstName: data.name,
    //   lastName: data.surname,
    //   publicMetadata: { role: "parent" },
    // });

    // await prisma.parent.create({
    //   data: {
    //     id: user.id,
    //     username: data.username,
    //     email: data.email || "",
    //     name: data.name || "",
    //     surname: data.surname || "",
    //     phone: data?.phone || "",
    //     address: data?.address || "",
    //   },
    // });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating parent:", err);
    return { success: false, error: true };
  }
};

export const updateParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    // await clerkClient.users.updateUser(data.id, {
    //   username: data.username,
    //   ...(data.password && { password: data.password }),
    //   firstName: data.name,
    //   lastName: data.surname,
    // });

    await prisma.parent.update({
      where: {
        id: data.id,
      },
      data: {
        username: data.username,
        email: data.email || "",
        name: data.name || "",
        surname: data.surname || "",
        phone: data?.phone || "",
        address: data?.address || "",
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating parent:", err);
    return { success: false, error: true };
  }
};

export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    // await clerkClient.users.deleteUser(id);

    // await prisma.parent.delete({
    //   where: {
    //     id: id,
    //   },
    // });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting parent:", err);
    return { success: false, error: true };
  }
};