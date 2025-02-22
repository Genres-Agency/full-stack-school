"use server";

import { revalidatePath } from "next/cache";
import { UserSchema } from "../schema/formValidationSchemas";
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean };

type ResultActionResponse = {
  success: boolean;
  result?: any;
  error?: string;
};

export const createUser = async (
  currentState: CurrentState,
  data: UserSchema
) => {
  try {
    await prisma.user.create({
      data: {
        email: data.email,
        password: data.password, // Ensure to hash the password before saving
        name: data.name || "",
        username: data.username,
        role: data.role,
      },
    });

    revalidatePath("/dashboard/users");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateUser = async (
  currentState: CurrentState,
  data: UserSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        email: data.email,
        name: data.name || "",
        username: data.username,
        role: data.role,
      },
    });
    
    revalidatePath("/dashboard/users");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteUser = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/dashboard/users");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const getUserByEmail = async (email: string): Promise<ResultActionResponse> => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return { success: true, result: user };
  } catch (error) {
    return { success: false, error: "Error fetching user by email" };
  }
};

export const getUserById = async (id: string): Promise<ResultActionResponse> => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return { success: true, result: user };
  } catch (error) {
    return { success: false, error: "Error fetching user by ID" };
  }
};

export const getUserFromDb = async (
  email: string,
  passwordHash: string
): Promise<ResultActionResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
        password: passwordHash, // Adjust this based on your authentication logic
      },
    });
    return { success: true, result: user };
  } catch (error) {
    return { success: false, error: "Error authenticating user" };
  }
};
