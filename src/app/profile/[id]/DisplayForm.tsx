"use client";

import { axios } from "@/lib/axios";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function DisplayForm({ user }: { user: User }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function handleSubmit() {
    setLoading(true);

    try {
      const res = await axios.put("/auth/update", {
        id: user.id,
        name,
        email,
        oldPassword,
        newPassword,
      });

      setError(null);
      setLoading(false);
      window.location.reload();
    } catch (res: any) {
      setLoading(false);
      console.log("Error", res.response.data.error);
      setError(res.response.data.error);
    }
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <Image
        src={user.image || "/user.png"}
        alt={user.name || "User"}
        width={200}
        height={200}
        className="rounded-full mb-10"
      />

      <input
        type="text"
        className="appearance-none border rounded py-2 px-3 text-gray-300 mb-3 leading-tight border-slate-600 bg-transparent focus:outline-none w-[500px]"
        value={name!}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />

      <input
        type="email"
        className="appearance-none border rounded  w-[500px] py-2 px-3 text-gray-300 mb-3 leading-tight border-slate-600 bg-transparent focus:outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        type="password"
        className="appearance-none border rounded  w-[500px] py-2 px-3 text-gray-300 mb-3 leading-tight border-slate-600 bg-transparent focus:outline-none"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder="Old Password"
      />

      <input
        type="password"
        className="appearance-none border rounded  w-[500px] py-2 px-3 text-gray-300 mb-3 leading-tight border-slate-600 bg-transparent focus:outline-none"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        disabled={loading}
        onClick={() => signOut()}
        className="bg-red-500 mt-5 hover:bg-red-600 text-white font-bold py-2 px-4 rounded active:scale-90 transition-all mx-auto block"
      >
        Logout
      </button>

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="bg-blue-500 mt-5 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded active:scale-90 transition-all mx-auto block"
      >
        Update
      </button>
    </div>
  );
}
