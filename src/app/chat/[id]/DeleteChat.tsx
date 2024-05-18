"use client";

import { axios } from "@/lib/axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

export default function DeleteChat({ userId }: { userId: string }) {
  const [openPopup, setOpenPopup] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const res = await axios.delete("/chat", {
      data: { userId: userId },
    });

    if (res.data.success) {
      setOpenPopup(false);
      router.push("/");
      router.refresh();
    }
  }

  if (openPopup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-slate-800 p-5 rounded-lg">
          <h2 className="text-2xl font-bold text-white">
            Are you sure you want to delete this chat?
          </h2>

          <div className="flex items-center justify-center gap-5 mt-5">
            <button
              className="bg-red-500 text-white px-5 py-2 rounded-lg active:scale-95 transition-transform"
              onClick={() => setOpenPopup(false)}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white px-5 py-2 rounded-lg active:scale-95 transition-transform"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button className="text-lg text-red-500" onClick={() => setOpenPopup(true)}>
      <FaRegTrashAlt />
    </button>
  );
}
