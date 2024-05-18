import { auth } from "@/app/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Header() {
  const session = await auth();

  return (
    <header className="flex justify-between">
      <Link href="/" className="text-3xl font-bold golden">
        Chatty
      </Link>

      {/* Profile */}
      <Link href={`/profile/${session?.user?.id}`}>
        <Image
          src={session?.user?.image || "/user.png"}
          alt="Profile"
          width={50}
          height={50}
          className="rounded-full"
        />
      </Link>
    </header>
  );
}
