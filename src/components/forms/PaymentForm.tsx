"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { paymentSchema, PaymentSchema } from "@/schema/formValidationSchemas";
import { createPayment, updatePayment } from "@/lib/paymentAction";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const PaymentForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: PaymentSchema;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentSchema>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: data?.amount || 0,
      status: data?.status || "NotPaid",
      studentId: data?.studentId || "",
    },
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      if (type === "create") {
        await createPayment(formData, { success: false, error: false });
        toast.success("Payment record created!");
      } else {
        await updatePayment(data?.id!, formData, {
          success: false,
          error: false,
        });
        toast.success("Payment record updated!");
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Error saving payment record!");
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex flex-col gap-6 bg-white dark:bg-[#18181b] p-4 rounded-md shadow-md"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <X size={20} />
      </button>

      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Payment Record" : "Update Payment Record"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Student ID"
          name="studentId"
          register={register}
          error={errors.studentId}
          type="text"
        />
        <InputField
          label="Amount"
          name="amount"
          register={register}
          error={errors.amount}
          type="number"
        />

        {/* Payment Status Dropdown */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm font-medium">Payment Status</label>
          <select
            {...register("status")}
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 mt-1 bg-white dark:bg-gray-900"
          >
            <option value="NotPaid">Not Paid</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}

        </div>
      </div>

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

export default PaymentForm;
