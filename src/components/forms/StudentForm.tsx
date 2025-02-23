"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import { studentSchema, StudentSchema } from "@/schema/formValidationSchemas";
import { createStudent, updateStudent } from "@/lib/studentAction";
import { useRouter } from "next/navigation";
import ImageUpload from "../shared/ImageUpload";
import toast from "react-hot-toast";

const StudentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const bloodGroups = ["A(-ve)", "B(+ve)", "B(-ve)", "O(+ve)", "O(-ve)", "AB(+ve)", "AB(-ve)"];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createStudent : updateStudent,
    {
      success: false,
      error: false,
    }
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(data?.image || "");
  const [loading, setLoading] = useState(false);
  const uploadImage = async () => {
    if (!selectedFile) return imageUrl; // If no new file, use existing URL

    const formData = new FormData();
    formData.append("image", selectedFile);

    const IMAGEBB_API_KEY = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY;
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMAGEBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data.url; // Return the uploaded image URL
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error(error);
      return ""; // Return empty string if upload fails
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    const uploadedImageUrl = await uploadImage(); // Upload image before form submission
    const payload = { ...formData, img: uploadedImageUrl }; // Include image URL in payload

    React.startTransition(() => {
      formAction(payload);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`Student has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error(`Student has not been ${type === "create" ? "created" : "updated"}!`);
    }
  }, [state, router, type, setOpen]);

  const { grades, classes } = relatedData || {};


  return (
    <form className="flex flex-col gap-4 bg-white dark:bg-[#18181b] p-4 rounded-md shadow-md" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update the student"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">Personal Information</span>
      <div className="flex justify-between flex-wrap gap-4">

        <InputField
          label="First Name*"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name*"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
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
        <InputField
          label="Phone*"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address*"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Blood Group</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("bloodType")}
            defaultValue={data?.bloodType}
          >
            {bloodGroups.map((group) => (
              <option value={group} key={group}>
                {group}
              </option>
            ))}
          </select>
          {errors.bloodType?.message && (
            <p className="text-xs text-red-400">{errors.bloodType.message.toString()}</p>
          )}
        </div>
        <InputField
          label="Birthday*"
          name="birthday"
          defaultValue={data?.birthday?.toISOString().split("T")[0]}
          register={register}
          error={errors.birthday}
          type="date"
        />
          <InputField
          label="Parent Name*"
          name="parentName"
          defaultValue={data?.parentName}
          register={register}
          error={errors.parentName}
        />
        <InputField
          label="Parent NID*"
          name="parentNId"
          defaultValue={data?.parentNId ? String(data.parentNId) : undefined}
          register={register}
          error={errors.parentNId}
          type="number"
        />
        
          <InputField
            label="Student Id*"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors.id}
          />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex*</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">{errors.sex.message.toString()}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId}
          >
            {grades?.map((grade: { id: number; level: number }) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">{errors.gradeId.message.toString()}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {classes?.map(
              (classItem: {
                id: number;
                name: string;
                capacity: number;
                _count: { students: number };
              }) => (
                <option value={classItem.id} key={classItem.id}>
                  {classItem.name} - {classItem._count.students}/{classItem.capacity} Capacity
                </option>
              )
            )}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">{errors.classId.message.toString()}</p>
          )}
        </div>
              {/* Add Image Upload Field */}
      <div className="flex flex-col w-full md:w-1/4 gap-2">
        <label className="text-gray-700 font-medium">Upload Image</label>
        <ImageUpload
            defaultImage={data?.img}
            onFileSelect={setSelectedFile}
          />
        {errors?.img && (
          <span className="text-red-500">Image upload is required.</span>
        )}
      </div>
      </div>
      {state.error && <span className="text-red-500">Something went wrong!</span>}
      <button type="submit" disabled={loading} className={`bg-sky-400 text-white p-2 rounded-md ${loading ? "opacity-50" : ""}`}>
        {loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
