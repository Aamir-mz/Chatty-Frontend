import SidebarDisplayChats from "./SidebarDisplayChats";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";

export default async function Sidebar() {
  const session = await auth();

  // Fetch chats from the database where user1 or user2 is the current user
  const chats = await prisma.chat.findMany({
    where: {
      OR: [{ user1: session!.user!.id }, { user2: session!.user!.id }],
    },
  });

  // Get the other user details for each chat
  const chatsWithUsers = await Promise.all(
    chats.map(async (chat) => {
      const user = await prisma.user.findFirst({
        where: {
          id: chat.user1 === session!.user?.id ? chat.user2 : chat.user1,
        },
      });

      return {
        ...chat,
        user,
      };
    })
  );

  // only include the user name, image and id in the chats array
  const userChats = chatsWithUsers.map((chat) => ({
    id: chat.user?.id as string,
    name: chat.user?.name as string,
    image: chat.user?.image as string | null,
  }));

  return (
    <div className="border w-[350px] h-full rounded-lg p-3 py-5 border-slate-600">
      <SidebarDisplayChats chats={userChats} />
    </div>
  );
}
