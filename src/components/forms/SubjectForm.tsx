"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { subjectSchema, SubjectSchema } from "@/schema/formValidationSchemas";
// import { createSubject, updateSubject } from "@/lib/actions";
import { createSubject, updateSubject } from "@/lib/subjectAction";
import { useFormState } from "react-dom";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


const SubjectForm = ({
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
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createSubject : updateSubject,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    // console.log(data);
    React.startTransition(() => {
      formAction(data);
    });

  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`Subject has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { teachers } = relatedData;

  return (
    <form className="flex flex-col gap-8 bg-white dark:bg-[#18181b] p-4 rounded-md shadow-md" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new subject" : "Update the subject"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject Id"
          name="id"
          defaultValue={data?.id}
          register={register}
          error={errors?.id}
        />
        <InputField
          label="Subject name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
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

export default SubjectForm;
