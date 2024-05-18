"use client";

import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function Auth() {
  const [selected, setSelected] = useState<"LOGIN" | "REGISTER">("LOGIN");

  return (
    <div className="w-[500px] border p-3 mx-auto mt-32 rounded-md border-slate-600 text-lg">
      {selected === "LOGIN" ? (
        <Login setSelected={setSelected} />
      ) : (
        <Register setSelected={setSelected} />
      )}
    </div>
  );
}
