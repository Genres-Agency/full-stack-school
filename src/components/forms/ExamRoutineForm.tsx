"use client";

import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  examRoutineSchema,
  ExamRoutineSchema,
} from "@/schema/formValidationSchemas";
import { useRouter } from "next/navigation";
import { createExamRoutine, updateExamRoutine } from "@/lib/examRoutineActions";
import InputField from "../InputField";
import toast from "react-hot-toast";

const ExamRoutineForm = ({
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
    formState: { errors, isSubmitting },
  } = useForm<ExamRoutineSchema>({
    resolver: zodResolver(examRoutineSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createExamRoutine : updateExamRoutine,
    { success: false, error: false }
  );

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      formAction(data); // Call your async function inside startTransition
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`Exam has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { classes = [], subjects = [] } = relatedData || {}; // Added subjects

  return (
    <form
      className="flex flex-col gap-8 bg-white dark:bg-[#18181b] p-4 rounded-md shadow-md"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new exam" : "Update the exam"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Exam title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Start Date"
          name="startTime"
          defaultValue={
            data?.startTime
              ? data.startTime.toISOString().slice(0, 16)
              : undefined
          }
          register={register}
          error={errors?.startTime}
          type="datetime-local"
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

        {/* Class Selection */}
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

        {/* Subject Selection */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjectId")}
            defaultValue={data?.subjectId}
          >
            {subjects.length > 0 ? (
              subjects.map((subjectItem: { id: number; name: string }) => (
                <option value={subjectItem.id} key={subjectItem.id}>
                  {subjectItem.name}
                </option>
              ))
            ) : (
              <option disabled>No subjects available</option>
            )}
          </select>
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
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

export default ExamRoutineForm;
