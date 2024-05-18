import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import DeleteChat from "./DeleteChat";

export default function Header({ user }: { user: User }) {
  return (
    <div className="border-b border-slate-600 w-full h-[10%]">
      <div className="flex items-center justify-between h-full p-5">
        {/* Info */}
        <div className="flex items-center gap-5">
          <Image
            src={user?.image || "/user.png"}
            alt={user?.name || "User"}
            width={60}
            height={60}
            className="rounded-full"
          />
          <h3 className="text-2xl font-bold">{user?.name}</h3>
        </div>

        <DeleteChat userId={user.id} />
      </div>
    </div>
  );
}
