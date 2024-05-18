import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const search = req.nextUrl.searchParams.get("search");

  // If there is a search query, return users that match the query
  if (search) {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: search,
        },
        NOT: {
          id: session.user.id,
        },
      },
    });

    // Check if the user is already in a chat with the current user
    // If they are not, add `new` property to the user object
    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ user1: session.user.id }, { user2: session.user.id }],
      },
    });

    const usersWithNew = users.map((user) => {
      const chat = chats.find(
        (chat) => chat.user1 === user.id || chat.user2 === user.id
      );

      if (!chat) {
        return {
          ...user,
          new: true,
        };
      }

      return user;
    });

    return Response.json(usersWithNew);
  }

  // Fetch chats from the database where user1 or user2 is the current user
  const chats = await prisma.chat.findMany({
    where: {
      OR: [{ user1: session.user.id }, { user2: session.user.id }],
    },
  });

  // Get the other user details for each chat
  const chatsWithUsers = await Promise.all(
    chats.map(async (chat) => {
      const user = await prisma.user.findFirst({
        where: {
          id: chat.user1 === session.user?.id ? chat.user2 : chat.user1,
        },
      });

      return {
        ...chat,
        user,
      };
    })
  );

  return Response.json(chatsWithUsers);
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await req.json();

  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  // Connect to the user
  const chat = await prisma.chat.create({
    data: {
      user1: session.user.id!,
      user2: userId,
    },
  });

  return Response.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await req.json();

  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  // Delete the messages
  await prisma.message.deleteMany({
    where: {
      OR: [
        { from: session.user.id, to: userId },
        { from: userId, to: session.user.id },
      ],
    },
  });

  // Delete the chat
  await prisma.chat.deleteMany({
    where: {
      OR: [
        { user1: session.user.id, user2: userId },
        { user1: userId, user2: session.user.id },
      ],
    },
  });

  return Response.json({ success: true });
}
