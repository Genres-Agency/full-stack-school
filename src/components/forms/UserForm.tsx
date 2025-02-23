"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import React, { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import { UserSchema, userSchema } from "@/schema/formValidationSchemas";
import { createUser, updateUser } from "@/lib/userAction";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import bcrypt from 'bcryptjs';

const UserForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
  });
  const [loading, setLoading] = useState(false);
  const [state, formAction] = useActionState(
    type === "create" ? createUser : updateUser,
    {
      success: false,
      error: false,
    }
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`User has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      if (type === "create" && formData.password) {
        // Hash password before sending to server
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(formData.password, salt);
        formData.password = hashedPassword;
      }
      React.startTransition(() => {
        formAction(formData);
      });

    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit form");
    }
  });

  return (
    <form className="flex flex-col gap-8 bg-white dark:bg-[#18181b] p-4 rounded-md shadow-md" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new user" : "Update the user"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Name*"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Username*"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email*"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        {type === "create" && (
          <InputField
            label="Password*"
            name="password"
            type="password"
            register={register}
            error={errors?.password}
          />
        )}
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Role*</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("role")}
            defaultValue={data?.role}
          >
            <option value="">Select Role</option>
            <option value="ADMIN">Admin</option>
            <option value="TEACHER">Teacher</option>
            <option value="STUDENT">Student</option>
          </select>
          {errors.role?.message && (
            <p className="text-xs text-red-400">
              {errors.role.message.toString()}
            </p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button
        type="submit"
        disabled={loading}
        className={`bg-sky-400 text-white p-2 rounded-md ${loading ? "opacity-50" : ""}`}
      >
        {loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default UserForm;