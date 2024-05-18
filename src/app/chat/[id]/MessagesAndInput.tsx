"use client";

import { axios } from "@/lib/axios";
import { pusher } from "@/lib/pusher/client";
import { Message, User } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";

export default function MessagesAndInput({
  currentUserId,
  // opposite user
  user,
  messages,
}: {
  currentUserId: string;
  user: User;
  messages: Message[];
}) {
  const [messageList, setMessageList] = useState<Message[]>(messages);
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const channel = pusher
      .subscribe(`room-${currentUserId}-${user.id}`)
      .bind("message", (data: any) => {
        const { message } = data;
        // add the message to the messages array
        setMessageList((prev: any) => [...prev, message]);
      });

    return () => {
      channel.unbind();
    };
  }, []);

  // BUG: Scrolling not working
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);

  async function handleSubmit() {
    if (!input) return;

    const res = await axios.post("/message", {
      to: user.id,
      text: input,
    });

    if (res.data.error) {
      console.error(res.data.error);
      return;
    }

    setInput("");
    setMessageList((prev) => [...prev, res.data]);
  }

  return (
    <>
      {/* Messages */}
      <div className="h-[80%] w-full overflow-scroll" ref={messageBoxRef}>
        {messageList.map((message) => (
          <div
            key={message.id}
            className={`${
              message.from === currentUserId ? "flex-row-reverse" : "flex-row"
            } flex w-full items-center gap-5 p-5`}
          >
            <div
              className={`${
                message.from === user.id ? "bg-blue-600" : "bg-orange-600"
              } p-3 ${
                message.from === currentUserId
                  ? "rounded-br-none"
                  : "rounded-bl-none"
              } rounded-full text-white`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input form */}
      <form className="h-[10%] w-full flex justify-center items-center gap-5">
        <input
          className="w-[1000px] bg-transparent border border-slate-600 text-2xl p-2 px-5 rounded-md outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="text-3xl text-white hover:text-slate-400 active:scale-90 transform"
          formAction={handleSubmit}
        >
          <IoSend />
        </button>
      </form>
    </>
  );
}
