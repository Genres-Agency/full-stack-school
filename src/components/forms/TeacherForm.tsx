"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import React, { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import { teacherSchema, TeacherSchema } from "@/schema/formValidationSchemas";
import { createTeacher, updateTeacher } from "@/lib/teacherAction";
import { useRouter } from "next/navigation";
import ImageUpload from "../shared/ImageUpload";
import toast from "react-hot-toast";

const bloodTypes = [
  "A(+ve)",
  "A(-ve)",
  "B(+ve)",
  "B(-ve)",
  "O(+ve)",
  "O(-ve)",
  "AB(+ve)",
  "AB(-ve)",
];

const TeacherForm = ({
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(data?.image || "");
  const [loading, setLoading] = useState(false);

  const [state, formAction] = useActionState(
    type === "create" ? createTeacher : updateTeacher,
    {
      success: false,
      error: false,
    }
  );

  const uploadImage = async () => {
    if (!selectedFile) return imageUrl;

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
        return data.data.url;
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
      return "";
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const uploadedImageUrl = await uploadImage();
      const payload = { ...formData, img: uploadedImageUrl };
      React.startTransition(() => {
        formAction(payload);
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit form");
    }
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`Teacher has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { subjects } = relatedData || {};

  return (
    <form className="flex flex-col gap-8 bg-white dark:bg-[#18181b] p-4 rounded-md shadow-md" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new teacher" : "Update the teacher"}
      </h1>
      
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
          <label className="text-xs text-gray-500">Blood Group*</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("bloodType")}
            defaultValue={data?.bloodType}
          >
            <option value="">Select Blood Group</option>
            {bloodTypes.map((bloodType) => (
              <option value={bloodType} key={bloodType}>
                {bloodType}
              </option>
            ))}
          </select>
          {errors.bloodType?.message && (
            <p className="text-xs text-red-400">
              {errors.bloodType.message.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Joining Date*"
          name="joiningDate"
          defaultValue={data?.joiningDate?.toISOString().split("T")[0]}
          register={register}
          error={errors.joiningDate}
          type="date"
        />
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
          <label className="text-xs text-gray-500">Sex*</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subjects*</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjects", { required: "Please select at least one subject" })}
            defaultValue={data?.subjects}
          >
            <option value="">Select Subjects</option>
            {subjects?.map((subject: { id: number; name: string }) => (
              <option 
                value={subject.id} 
                key={subject.id}
                selected={data?.subjects?.includes(subject.id)}
              >
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjects?.message && (
            <p className="text-xs text-red-400">
              {errors.subjects.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-gray-700 font-medium">Upload Image</label>
          <ImageUpload
            defaultImage={data?.img}
            onFileSelect={setSelectedFile}
          />
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

export default TeacherForm;
