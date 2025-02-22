"use server";

import { revalidatePath } from "next/cache";
import {
  TeacherSchema,
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

export const createTeacher = async (
    currentState: CurrentState,
    data: TeacherSchema
  ) => {
    try {
      // const user = await clerkClient.users.createUser({
      //   username: data.username,
      //   password: data.password,
      //   firstName: data.name,
      //   lastName: data.surname,
      //   publicMetadata: { role: "teacher" },
      // });
  
      // await prisma.teacher.create({
      //   data: {
      //     id: user.id,
      //     username: data.username,
      //     name: data.name,
      //     surname: data.surname,
      //     email: data.email || null,
      //     phone: data.phone || null,
      //     address: data.address,
      //     img: data.img || null,
      //     bloodType: data.bloodType,
      //     sex: data.sex,
      //     joiningDate: data.joiningDate,
      //     subjects: {
      //       connect: data.subjects ? [{ id: parseInt(data.subjects) }] : [],
      //     },
      //   },
      // });
  
      // revalidatePath("/list/teachers");
      return { success: true, error: false };
    } catch (err) {
      console.log(err);
      return { success: false, error: true };
    }
  };
  
  export const updateTeacher = async (
    currentState: CurrentState,
    data: TeacherSchema
  ) => {
    if (!data.id) {
      return { success: false, error: true };
    }
    try {
      // const user = await clerkClient.users.updateUser(data.id, {
      //   username: data.username,
      //   ...(data.password !== "" && { password: data.password }),
      //   firstName: data.name,
      //   lastName: data.surname,
      // });
  
      await prisma.teacher.update({
        where: {
          id: data.id,
        },
        data: {
          ...(data.password !== "" && { password: data.password }),
          username: data.username,
          name: data.name,
          surname: data.surname,
          email: data.email || null,
          phone: data.phone || null,
          address: data.address,
          img: data.img || null,
          bloodType: data.bloodType,
          sex: data.sex,
          joiningDate: data.joiningDate,
          subjects: {
            set: data.subjects ? [{ id: parseInt(data.subjects) }] : [],
          },
        },
      });
      // revalidatePath("/list/teachers");
      return { success: true, error: false };
    } catch (err) {
      console.log(err);
      return { success: false, error: true };
    }
  };
  
  export const deleteTeacher = async (
    currentState: CurrentState,
    data: FormData
  ) => {
    const id = data.get("id") as string;
    try {
      // await clerkClient.users.deleteUser(id);
  
      await prisma.teacher.delete({
        where: {
          id: id,
        },
      });
  
      // revalidatePath("/list/teachers");
      return { success: true, error: false };
    } catch (err) {
      console.log(err);
      return { success: false, error: true };
    }
  };