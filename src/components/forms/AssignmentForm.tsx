"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { assignmentSchema, AssignmentSchema } from "@/schema/formValidationSchemas";
import { createAssignment, updateAssignment } from "@/lib/assignmentAction";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AssignmentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: AssignmentSchema;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAssignment : updateAssignment,
    { success: false, error: false }
  );

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`Assignment has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { subjects, classes, teachers } = relatedData || {};

  console.log(relatedData);
  

  return (
    <form className="flex flex-col gap-8 bg-white dark:bg-[#18181b] p-4 rounded-md shadow-md" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new assignment" : "Update the assignment"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField label="Assignment Title" name="title" register={register} error={errors.title} />
        <InputField label="Description" name="description" register={register} error={errors.description} type="textarea" />
        <InputField label="Due Date" name="dueDate" register={register} error={errors.dueDate} type="datetime-local" />

        {type === "update" && data?.id && <input type="hidden" {...register("id")} defaultValue={data.id.toString()} />}

        {/* Subject Selection */}
        {/* <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subjects</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("subject")}>
            <option value="" disabled>Select a Subject</option>

            {subjects?.map((subject: { id: number; name: string }) => (
              <option value={subject.id} key={subject.id} selected={data && subject.id === Number(data.subject)}>
                {subject.name}
              </option>
            ))}

          </select>
          {errors.subject?.message && <p className="text-xs text-red-400">{errors.subject.message}</p>}
        </div> */}


        {/* Class Selection */}
        {/* <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("class")}>
            <option value="" disabled>Select a Class</option>
            {relatedData?.classes?.map((classItem: { id: number; name: string }) => (
              <option key={classItem.id} value={classItem.id} selected={data?.class === classItem.id.toString()}>
                {classItem.name}
              </option>
            ))}
          </select>
          {errors.class && <p className="text-xs text-red-400">{errors.class.message}</p>}
        </div> */}

        {/* Teacher Selection */}
        {/* <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("teacher")}>
            <option value="" disabled>Select a Teacher</option>
            {relatedData?.teachers?.map((teacher: { id: number; name: string; surname: string }) => (
              <option key={teacher.id} value={teacher.id} selected={data?.teacher === teacher.id.toString()}>
                {teacher.name} {teacher.surname}
              </option>
            ))}
          </select>
          {errors.teacher && <p className="text-xs text-red-400">{errors.teacher.message}</p>}
        </div> */}
      </div>

      {state.error && <span className="text-red-500">Something went wrong!</span>}

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AssignmentForm;
