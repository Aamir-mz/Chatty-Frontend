import React from "react";
import { FaMousePointer } from "react-icons/fa";

export default async function Page() {
  return (
    <h2 className="flex w-full h-full items-center justify-center text-3xl font-bold gap-3">
      <FaMousePointer />
      Click any user to start a chat
    </h2>
  );
}
