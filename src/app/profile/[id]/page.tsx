import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import React from "react";
import DisplayForm from "./DisplayForm";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const { id } = params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <h1 className="text-5xl text-red-500 font-semibold">User not found!</h1>
      </div>
    );
  }

  if (user.id !== session?.user?.id) {
    return (
      <div className="flex flex-col items-center mt-10">
        <Image
          src={user.image || "/user.png"}
          alt={user.name || "User"}
          width={200}
          height={200}
          className="rounded-full"
        />

        <h1 className="text-3xl font-bold mt-5">{user.name}</h1>

        <p className="text-xl text-gray-400 mt-3">{user.email}</p>
      </div>
    );
  }

  // Display profile edit form
  return <DisplayForm user={user} />;
}
