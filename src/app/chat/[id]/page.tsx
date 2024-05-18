import { prisma } from "@/lib/prisma";
import Image from "next/image";
import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import Header from "./Header";
import MessagesAndInput from "./MessagesAndInput";
import { auth } from "@/app/auth";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const session = await auth();

  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  // Get all messages between the current user and the other user
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          from: session?.user?.id,
          to: id,
        },
        {
          from: id,
          to: session?.user?.id,
        },
      ],
    },
  });

  return (
    <div className="h-full">
      <Header user={user!} />
      <MessagesAndInput
        user={user!}
        messages={messages}
        currentUserId={session?.user?.id!}
      />
    </div>
  );
}
