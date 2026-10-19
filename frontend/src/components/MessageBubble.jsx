import React from "react";
import Markdown from "react-markdown";

const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div className={`flex mx-5 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit px-4 py-2.5 rounded-2xl text-[14.5px] leading-relaxed overflow-hidden
      ${
        isUser
          ? "bg-linear-to-br from-sky-400 to-gray-700 text-white max-w-[50%] rounded-tr-sm"
          : " text-slate-200 rounded-tl-sm"
      }
      `}
      >
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
};

export default MessageBubble;
