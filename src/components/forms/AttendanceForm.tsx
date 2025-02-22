"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  attendanceSchema,
  AttendanceSchema,
} from "@/lib/formValidationSchemas";
// import { createAttendance, updateAttendance } from "@/lib/actions";
import { createAttendance, updateAttendance } from "@/lib/attendenceAction";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";

const AttendanceForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  relatedData: any;
  type: "create" | "update";
  data?: AttendanceSchema;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: data
      ? { ...data, date: data.date ? new Date(data.date) : undefined }
      : {},
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData: AttendanceSchema) => {
    try {
      const response =
        type === "create"
          ? await createAttendance(formData)
          : await updateAttendance(data?.id!, formData);

      if (response.success) {
        toast(
          `Attendance has been ${type === "create" ? "created" : "updated"}!`
        );
        setOpen(false);
        router.refresh();
      } else {
        toast(`Failed: ${response.error}`);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast("Error submitting data. Check console.");
    }
  });

  const { classes = [] } = relatedData || {};

  return (
    <form
      className="flex flex-col gap-8 bg-white dark:bg-[#18181b] p-4 rounded-md shadow-md"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create Attendance Record"
          : "Update Attendance Record"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* <InputField
          label="Class Name"
          name="className"
          register={register}
          error={errors?.className}
        /> */}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {classes.length > 0 ? (
              classes.map((classItem: { id: number; name: string }) => (
                <option value={classItem.id} key={classItem.id}>
                  {classItem.name}
                </option>
              ))
            ) : (
              <option disabled>No classes available</option>
            )}
          </select>
        </div>
        <InputField
          label="Date"
          name="date"
          type="date"
          defaultValue={
            data?.date ? data.date.toISOString().slice(0, 10) : undefined
          }
          register={register}
          error={errors?.date}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("day")}
            defaultValue={data?.day || ""}
          >
            <option value="">Select Day</option>
            <option value="MONDAY">MONDAY</option>
            <option value="TUESDAY">TUESDAY</option>
            <option value="WEDNESDAY">WEDNESDAY</option>
            <option value="THURSDAY">THURSDAY</option>
            <option value="FRIDAY">FRIDAY</option>
            <option value="SATURDAY">SATURDAY</option>
            <option value="SUNDAY">SUNDAY</option>
          </select>
          {errors.day && (
            <p className="text-xs text-red-400">{errors.day.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Total Students</label>
          <input
            type="number"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("total", { valueAsNumber: true })}
            min="0"
          />
          {errors.total && (
            <p className="text-xs text-red-400">{errors.total.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Present Students</label>
          <input
            type="number"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("present", { valueAsNumber: true })}
            min="0"
          />
          {errors.present && (
            <p className="text-xs text-red-400">{errors.present.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Processing..."
          : type === "create"
          ? "Create"
          : "Update"}
      </button>
    </form>
  );
};

export default AttendanceForm;
