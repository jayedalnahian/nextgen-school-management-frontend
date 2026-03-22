import React from "react";

export default function LoginForm() {
  return (
    <form className="space-y-4">
      <div>
        <label>Email</label>
        <input type="email" className="border p-2 w-full" />
      </div>
      <div>
        <label>Password</label>
        <input type="password" className="border p-2 w-full" />
      </div>
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
}
