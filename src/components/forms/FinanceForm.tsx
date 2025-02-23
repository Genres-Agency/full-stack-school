"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { financeSchema, FinanceSchema } from "@/schema/formValidationSchemas";
import { createFinance, updateFinance } from "@/lib/financeAction";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const FinanceForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: FinanceSchema;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FinanceSchema>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      type: data?.type || "income",
      amount: data?.amount || 0,
      description: data?.description || "",
      date: data?.date || new Date(),
    },
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      if (type === "create") {
        await createFinance(formData);
        toast.success("Finance record created!");
      } else {
        await updateFinance(data?.id!, formData);
        toast.success("Finance record updated!");
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Error saving finance record!");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8 bg-white dark:bg-[#18181b] p-4 rounded-md shadow-md">
      <h1 className="text-xl font-semibold">{type === "create" ? "Create Finance Record" : "Update Finance Record"}</h1>

      <div className="flex justify-between flex-wrap gap-4 w-full ">
        {/* Finance Type Dropdown */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Finance Type</label>

          <select          
            {...register("type")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            defaultValue={data?.type || "income"}
            required
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {errors.type && <p className="text-xs text-red-400">{errors.type.message?.toString()}</p>}
        </div>

        {/* Amount Input */}
        <InputField
          label="Amount"
          name="amount"
          defaultValue={data?.amount?.toString() || ""}
          register={(fieldName: "amount") => register(fieldName, { valueAsNumber: true })}
          error={errors.amount}
          type="number"
        />

        {/* Description Input */}
        <InputField
          label="Description"
          name="description"
          register={register}
          defaultValue={data?.description || ""}
          error={errors.description}
          type="text"
        />

        {/* Date Input */}
        <InputField
          label="Date"
          name="date"
          register={register}
          defaultValue={data?.date ? data.date.toISOString().slice(0, 10) : undefined}
          error={errors.date}
          type="date"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-sky-500 text-white p-2 rounded-md disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default FinanceForm;
