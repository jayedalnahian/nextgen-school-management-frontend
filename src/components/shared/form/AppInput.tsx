import React from "react";

export default function AppInput({ label, type = "text", ...props }: any) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input type={type} className="w-full border p-2 rounded" {...props} />
    </div>
  );
}
