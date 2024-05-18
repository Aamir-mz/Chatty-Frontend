"use client";

import { axios } from "@/lib/axios";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";

export default function SidebarDisplayChats({
  chats,
}: {
  chats: { id: string; name: string; image: string | null }[];
}) {
  const [searchedChats, setSearchedChats] = useState<
    (User & { new: boolean | null })[]
  >([]);
  const [search, setSearch] = useState("");

  async function searchChats() {
    const res = await axios.get("/chat", {
      params: {
        search,
      },
    });

    console.log(res.data);
    setSearchedChats(res.data);
  }

  async function connectChat(userId: string) {
    const res = await axios.post(`/chat`, {
      userId,
    });

    if (res.data.error) {
      alert(res.data.error);
      return;
    } else {
      setSearchedChats((prev) =>
        prev.map((chat) => {
          if (chat.id === userId) {
            return { ...chat, new: false };
          }
          return chat;
        })
      );
    }
  }

  return (
    <>
      {/* Search bar */}
      <div className="flex items-center gap-3 p-3 rounded-lg">
        <input
          type="text"
          placeholder="Search chats"
          className="outline-none text-white bg-slate-800 w-full p-2 rounded-lg text-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {searchedChats.length > 0 ? (
          <button
            className="bg-slate-800 p-3 rounded-full text-xl hover:bg-slate-700 transition-colors active:scale-90 transform"
            onClick={() => {
              setSearch("");
              setSearchedChats([]);
            }}
          >
            <FaTimes />
          </button>
        ) : (
          <button
            className="bg-slate-800 p-3 rounded-full text-xl hover:bg-slate-700 transition-colors active:scale-90 transform"
            onClick={searchChats}
          >
            <FaSearch />
          </button>
        )}
      </div>

      {/* Chats */}
      {searchedChats.length > 0 && (
        <div className="flex flex-col gap-5 mt-5 h-[88%] overflow-scroll">
          {searchedChats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center justify-between hover:bg-slate-800 p-3 rounded-lg transition-colors"
            >
              <Link
                href={`/profile/${chat.id}`}
                className="flex items-center gap-5 w-full"
              >
                <Image
                  src={chat.image || "/user.png"}
                  alt={chat.name!}
                  className="rounded-full"
                  width={50}
                  height={50}
                />
                <h3>{chat.name}</h3>
              </Link>

              {chat.new && (
                <button
                  className="bg-slate-800 p-2 rounded-full text-lg hover:bg-slate-700 transition-colors active:scale-90 transform"
                  title="New chat"
                  onClick={() => connectChat(chat.id)}
                >
                  <FaPlus />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {searchedChats.length === 0 && (
        <div className="flex flex-col gap-5 mt-5 h-[88%] overflow-scroll">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              className="flex items-center gap-5 hover:bg-slate-800 p-3 rounded-lg transition-colors"
              href={`/chat/${chat.id}`}
            >
              <Image
                src={chat.image || "/user.png"}
                alt={chat.name}
                className="rounded-full"
                width={50}
                height={50}
              />
              <div>
                <h3>{chat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
