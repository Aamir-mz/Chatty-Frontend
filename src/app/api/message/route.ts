import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";
import { getPusherInstance } from "@/lib/pusher/server";
import { NextRequest } from "next/server";

const pusher = getPusherInstance();

// post a message
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { to, text } = await req.json();

  if (!to || !text) {
    return Response.json({ error: "Missing parameters" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      from: session.user.id!,
      to,
      text,
    },
  });

  pusher.trigger(`room-${to}-${session.user.id}`, "message", {
    message,
  });

  return Response.json(message);
}
