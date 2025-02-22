import prisma from "./prisma";


// export const createUser = async (data: { email: string; password: string; name: string; username: string; }) => {
//   try {
//     const user = await prisma.user.create({
//       data: {
//         email: data.email,
//         password: data.password, // Ensure to hash the password before saving
//         name: data.name,
//         username: data.username,
//       },
//     });
//     return { success: true, user };
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return { success: false, error: true };
//   }
// };

// export const updateUser = async (id: string, data: { email?: string; name?: string; surname?: string; }) => {
//   try {
//     const user = await prisma.user.update({
//       where: { id },
//       data,
//     });
//     return { success: true, user };
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return { success: false, error: true };
//   }
// };

// export const deleteUser = async (id: string) => {
//   try {
//     await prisma.user.delete({
//       where: { id },
//     });
//     return { success: true };
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     return { success: false, error: true };
//   }
// };

export const getUserByEmail = async (email: string) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      console.log("user>>", user);
      return user;
    } catch {
      console.log("user error");
      return null;
    }
  };
  
  export const getUserById = async (id: string) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      return user;
    } catch {
      return null;
    }
  };

export async function getUserFromDb(email: string, passwordHash: string) {
  return await prisma.user.findUnique({
    where: {
      email: email,
      password: passwordHash, // Adjust this based on your authentication logic
    },
  });
}