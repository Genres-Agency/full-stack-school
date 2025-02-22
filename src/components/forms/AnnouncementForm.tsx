"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  announcementSchema,
  AnnouncementSchema,
} from "@/schema/formValidationSchemas";
// import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import {
  createAnnouncement,
  updateAnnouncement,
} from "@/lib/announcementAction";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import ImageUpload from "../shared/ImageUpload";
import toast from "react-hot-toast";

export interface FormProps {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}

const AnnouncementForm: React.FC<FormProps> = ({
  type,
  data,
  setOpen,
  relatedData,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(data?.image || "");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAnnouncement : updateAnnouncement,
    { success: false, error: false }
  );

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

    formAction(payload);
  });
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast.success(
        `Announcement has been ${type === "create" ? "created" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  return (
    <form
      className="flex flex-col gap-8 bg-white dark:bg-[#18181b] p-4 rounded-md shadow-md"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new announcement"
          : "Update the announcement"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
        <InputField
          label="Start Date"
          name="startDate"
          defaultValue={data?.startDate}
          register={register}
          error={errors?.startDate}
          type="datetime-local"
        />
        <InputField
          label="End Date"
          name="endDate"
          defaultValue={data?.endDate}
          register={register}
          error={errors?.endDate}
          type="datetime-local"
        />
        <div className="flex flex-col gap-4 w-1/4">
          <label className="text-gray-700 font-medium dark:text-gray-500">
            Upload Image(optional)
          </label>
          <ImageUpload
            defaultImage={data?.img}
            onFileSelect={setSelectedFile}
          />
        </div>
      </div>

      {/* Image Upload */}

      {state.error && <span className="text-red-500">{state.error}</span>}

      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-400 text-white p-2 rounded-md ${
          loading ? "opacity-50" : ""
        }`}
      >
        {loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AnnouncementForm;
