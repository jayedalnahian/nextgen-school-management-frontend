import React from "react";

export default function SubmitButton({ children, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="submit"
      className="bg-primary text-white px-4 py-2 rounded font-semibold"
      {...props}
    >
      {children}
    </button>
  );
}
