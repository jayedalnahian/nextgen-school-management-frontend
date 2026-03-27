"use client";

/**
 * ============================================================================
 * Example: How to use the FormBuilder component
 * ============================================================================
 *
 * This shows how to define a Zod schema, a fields array,
 * and compose them with `<FormBuilder />`.
 *
 * Place this file alongside your page component or remove it —
 * it's purely for reference.
 * ============================================================================
 */

import { z } from "zod";
import {
  FormBuilder,
  type FormFieldConfig,
} from "@/components/shared/form/FormBuilder";

// ---------------------------------------------------------------------------
// 1. Define Zod Schema (Zod v4 syntax)
// ---------------------------------------------------------------------------

const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z.coerce
    .number()
    .min(3, "Minimum age is 3")
    .max(25, "Maximum age is 25"),
  classId: z.string().min(1, "Please select a class"),
  gender: z.string().min(1, "Please select a gender"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  dateOfBirth: z.date({ error: "Date of birth is required" }),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
  agreeTerms: z.boolean().refine((v) => v === true, "You must agree"),
});

type StudentFormValues = z.infer<typeof studentSchema>;

// ---------------------------------------------------------------------------
// 2. Define Fields Configuration
// ---------------------------------------------------------------------------

const studentFields: FormFieldConfig<StudentFormValues>[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter student name",
    className: "sm:col-span-1",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "student@school.com",
    className: "sm:col-span-1",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    className: "sm:col-span-1",
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "10",
    className: "sm:col-span-1",
  },
  {
    name: "classId",
    label: "Class",
    type: "select",
    placeholder: "Select a class",
    options: [
      { label: "Class 1", value: "cls-1" },
      { label: "Class 2", value: "cls-2" },
      { label: "Class 3", value: "cls-3" },
    ],
    className: "sm:col-span-1",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    placeholder: "Select gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
    className: "sm:col-span-1",
  },
  {
    name: "subjects",
    label: "Subjects",
    type: "multi-select",
    options: [
      { label: "Mathematics", value: "math" },
      { label: "English", value: "eng" },
      { label: "Science", value: "sci" },
      { label: "History", value: "hist" },
    ],
    className: "sm:col-span-2",
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
    placeholder: "Pick a date",
    className: "sm:col-span-1",
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    placeholder: "Enter full address...",
    className: "sm:col-span-2",
  },
  {
    name: "isActive",
    label: "Active Student",
    type: "switch",
    className: "sm:col-span-1",
  },
  {
    name: "agreeTerms",
    label: "I agree to the terms and conditions",
    type: "checkbox",
    className: "sm:col-span-2",
  },
];

// ---------------------------------------------------------------------------
// 3. Use the FormBuilder
// ---------------------------------------------------------------------------

// export default function StudentFormExample() {
//   const handleSubmit = async (data: StudentFormValues) => {
//     // call your API here
//   };

//   return (
//     <div className="mx-auto max-w-2xl p-6">
//       <h1 className="text-2xl font-bold mb-6">Add New Student</h1>

//       <FormBuilder<StudentFormValues>
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         schema={studentSchema as any}
//         fields={studentFields}
//         onSubmit={handleSubmit}
//         defaultValues={{
//           name: "",
//           email: "",
//           password: "",
//           age: undefined as unknown as number,
//           classId: "",
//           gender: "",
//           subjects: [],
//           dateOfBirth: undefined,
//           address: "",
//           isActive: true,
//           agreeTerms: false,
//         }}
//         submitText="Create Student"
//         onCancel={() => // console.log("Cancelled")}
//         cancelText="Cancel"
//         // isLoading={mutation.isPending}  ← pass Tanstack Query state
//       />
//     </div>
//   );
// }
