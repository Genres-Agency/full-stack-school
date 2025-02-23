"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { admissionSchema, AdmissionSchema } from "@/schema/formValidationSchemas";
// import { createAdmission, updateAdmission } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { createAdmission, updateAdmission } from "@/lib/admissionAction";
import toast from "react-hot-toast";

export interface FormProps {
  type: "create" | "update";
  data?: AdmissionSchema;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}

const AdmissionForm: React.FC<FormProps> = ({
  type,
  data,
  setOpen,
  relatedData,
}) => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<AdmissionSchema>({
    resolver: zodResolver(admissionSchema),
    defaultValues: data || {},
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (formData: AdmissionSchema) => {
    setLoading(true);
    try {
      const response = type === "create"
        ? await createAdmission(formData)
        : await updateAdmission(data?.id!, formData);

      if (response.success) {
        toast.success(`${type === "create" ? "Created" : "Updated"} admission successfully!`);
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Failed to submit admission data.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const bloodGroup = [
    "A(+ve)",
    "A(-ve)",
    "B(+ve)",
    "B(-ve)",
    "O(+ve)",
    "O(-ve)",
    "AB(+ve)",
    "AB(-ve)",
  ];
  const board = [
    "Barishal",
    "Dhaka",
    "Cumilla",
    "Dinajpur",
    "Jessore",
    "Mymensingh",
    "Rajshahi",
    "Sylhet",
    "Madrasah",
    "BTEB",
  ];
  return (
    <div className="w-full mx-auto p-4 bg-white dark:bg-[#18181b] shadow-md rounded-md ">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Application Form for Admission
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-lg font-semibold mt-4">Personal Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Student&apos;s Name
            </label>
            <input
              type="text"
              {...register("studentName")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.studentName && <p className="text-red-500">{errors.studentName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Contact Number
            </label>
            <input
              type="text"
              {...register("contactNumber")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              maxLength={11}
            />
            {errors.contactNumber && <p className="text-red-500">{errors.contactNumber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Blood Group
            </label>
            <select {...register("bloodGroup")} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              {bloodGroup.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.bloodGroup && <p className="text-red-500">{errors.bloodGroup.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />  
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Nationality
            </label>
            <input
              type="text"
              value="Bangladeshi"
              {...register("nationality")}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800"
            />
            {errors.nationality && <p className="text-red-500">{errors.nationality.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Gender
            </label>
            <select {...register("gender")} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option>Male</option>
              <option>Female</option>
              <option>Others</option>
            </select>
            {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Birth Certificate/NID No
            </label>
            <input
              type="text"
              {...register("birthCertificate")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.birthCertificate && <p className="text-red-500">{errors.birthCertificate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Religion
            </label>
            <select {...register("religion")} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option>Islam</option>
              <option>Hindu</option>
              <option>Christian</option>
              <option>Others</option>
            </select>
            {errors.religion && <p className="text-red-500">{errors.religion.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Date of Birth
            </label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Present Address
            </label>
            <input
              type="text"
              {...register("presentAddress")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.presentAddress && <p className="text-red-500">{errors.presentAddress.message}</p>}
          </div>
        </div>

        <h2 className="text-lg font-semibold mt-4">Family Background</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Father&apos;s Name
            </label>
            <input
              type="text"
              {...register("fatherName")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.fatherName && <p className="text-red-500">{errors.fatherName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Father&apos;s Phone No
            </label>
            <input
              type="text"
              {...register("fatherPhone")}
              maxLength={11}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.fatherPhone && <p className="text-red-500">{errors.fatherPhone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Father&apos;s Occupation
            </label>
            <input
              type="text"
              {...register("fatherOccupation")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.fatherOccupation && <p className="text-red-500">{errors.fatherOccupation.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Mother&apos;s Name
            </label>
            <input
              type="text"
              {...register("motherName")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.motherName && <p className="text-red-500">{errors.motherName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Mother&apos;s Phone No
            </label>
            <input
              type="text"
              {...register("motherPhone")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              maxLength={11}
            />
            {errors.motherPhone && <p className="text-red-500">{errors.motherPhone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Mother&apos;s Occupation
            </label>
            <input
              type="text"
              {...register("motherOccupation")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.motherOccupation && <p className="text-red-500">{errors.motherOccupation.message}</p>}
          </div>
        </div>

        <h2 className="text-lg font-semibold mt-4">Educational Background</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              SSC/Equivalent
            </label>
            <select {...register("sscEquivalent")} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option>SSC</option>
              <option>Dhakhil</option>
              <option>Vocational</option>
              <option>Others</option>
            </select>
            {errors.sscEquivalent && <p className="text-red-500">{errors.sscEquivalent.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Group
            </label>
            <input
              type="text"
              {...register("sscGroup")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.sscGroup && <p className="text-red-500">{errors.sscGroup.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Board
            </label>
            <select {...register("sscBoard")} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              {board.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.sscBoard && <p className="text-red-500">{errors.sscBoard.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Board Roll
            </label>
            <input
              type="text"
              {...register("sscBoardRoll")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.sscBoardRoll && <p className="text-red-500">{errors.sscBoardRoll.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              GPA
            </label>
            <input
              type="text"
              {...register("sscGPA")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.sscGPA && <p className="text-red-500">{errors.sscGPA.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Passing Year
            </label>
            <input
              type="text"
              {...register("sscPassingYear")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.sscPassingYear && <p className="text-red-500">{errors.sscPassingYear.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Institute Name
            </label>
            <input
              type="text"
              {...register("sscInstituteName")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.sscInstituteName && <p className="text-red-500">{errors.sscInstituteName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              HSC/Equivalent
            </label>
            <select {...register("hscEquivalent")} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option>HSC</option>
              <option>Alim</option>
              <option>Diploma</option>
              <option>Others</option>
            </select>
            {errors.hscEquivalent && <p className="text-red-500">{errors.hscEquivalent.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Group
            </label>
            <input
              type="text"
              {...register("hscGroup")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.hscGroup && <p className="text-red-500">{errors.hscGroup.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Board
            </label>
            <select {...register("hscBoard")} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option>Barishal</option>
              <option>Dhaka</option>
              <option>Cumilla</option>
              <option>Dinajpur</option>
              <option>Jessore</option>
              <option>Mymensingh</option>
              <option>Rajshahi</option>
              <option>Sylhet</option>
              <option>Madrasah</option>
              <option>BTEB</option>
            </select>
            {errors.hscBoard && <p className="text-red-500">{errors.hscBoard.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Board Roll
            </label>
            <input
              type="text"
              {...register("hscBoardRoll")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.hscBoardRoll && <p className="text-red-500">{errors.hscBoardRoll.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              GPA
            </label>
            <input
              type="text"
              {...register("hscGPA")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.hscGPA && <p className="text-red-500">{errors.hscGPA.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Passing Year
            </label>
            <input
              type="text"
              {...register("hscPassingYear")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.hscPassingYear && <p className="text-red-500">{errors.hscPassingYear.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  ">
              Institute Name
            </label>
            <input
              type="text"
              {...register("hscInstituteName")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.hscInstituteName && <p className="text-red-500">{errors.hscInstituteName.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-sky-500 text-white p-2 rounded-md mt-4 ${loading ? "opacity-50" : ""}`}
        >
          {loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </button>
      </form>
      
    </div>
  );
};

export default AdmissionForm;
