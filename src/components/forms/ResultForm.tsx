"use client";

import { Dispatch, SetStateAction } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resultSchema, ResultSchema } from "@/schema/formValidationSchemas";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createResult } from "@/lib/resultAction";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


const ResultForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any; // Expected to contain studentId and existing results if updating
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: data || { studentId: "", subjects: [] }, // Ensure studentId is initialized
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects", // Matches schema
  });

  const router = useRouter();

  const getGrade = (marks: number): string => {
    if (marks >= 80) return "A+";
    if (marks >= 70) return "A";
    if (marks >= 60) return "A-";
    if (marks >= 50) return "B";
    if (marks >= 40) return "C";
    if (marks >= 33) return "D";
    return "F";

  };

  const onSubmit = handleSubmit(async (formData: ResultSchema) => {
    console.log("onSubmit triggered!");
    try {
      console.log("Form Data:", formData);

      if (!formData.studentId) {
        toast.error("Student ID is missing!");
        return;
      }

      if (!formData.subjects || formData.subjects.length === 0) {
        toast.error("Please add at least one subject.");
        return;
      }

      // Validate and prepare data for submission
      const resultsPayload = formData.subjects.map((subject) => ({
        studentId: formData.studentId,
        subjectId: Number(subject.subjectId), // Ensure it's a number
        marks: subject.marks,
        grade: getGrade(subject.marks),
      }));

      // console.log("Payload to API:", resultsPayload);

      // Send API request
      const response = await createResult(resultsPayload);

      if (response?.success) {
        toast.success("Result has been created!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(`Failed: ${response?.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Error submitting data. Check console.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 border rounded-lg bg-white dark:bg-[#18181b]">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create New Results" : "Update Results"}
      </h1>

      <div className="flex flex-col gap-2">
        <label className="block font-medium">Student ID:</label>
        <Input
          type="text"
          {...register("studentId")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          placeholder="Enter Student ID"
          required
        />
        {errors.studentId && (
          <p className="text-xs text-red-400">{errors.studentId.message}</p>
        )}
      </div>

      {/* Dynamic fields for subjects and marks */}
      <div>
        <h2 className="text-lg font-semibold">Subjects</h2>
        
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mt-4">
            <div className="flex flex-col w-full">
              <label className="block font-medium">Subject ID:</label>
              <Input
                type="number"
                placeholder="Subject ID"
                {...register(`subjects.${index}.subjectId`, { valueAsNumber: true})}
                min={0}

                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              />
              {errors.subjects?.[index]?.subjectId && (
                <p className="text-xs text-red-400">
                  {errors.subjects[index]?.subjectId?.message}
                </p>
              )}
            </div>
            

            <div className="flex flex-col w-full">
            <label className="block font-medium">Marks:</label>
            <Input
              type="number"
              placeholder="Marks"
              {...register(`subjects.${index}.marks`, { valueAsNumber: true })}
              min={0}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              required
            />
            </div>
            <Button type="button" className="bg-red-500 hover:text-red-500 mt-6 text-white" onClick={() => remove(index)}>Remove</Button>
            
          </div>
        ))}
        <Button
          className="bg-green-400 mt-2 flex order-end items-center text-white hover:text-green-500"
          type="button"
          onClick={() => append({ subjectId: 0, subjectName: "", marks: 0 })}
        >
          Add Subject
        </Button>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;
