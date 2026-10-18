"use client";
import { Mic, Paperclip, SendHorizontal } from "lucide-react";
import React, { useState } from "react";
import sendMessage from "../features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/messageSlice";

import { createConversation } from "../features/createConversation.js";
import {
  addConversation,
  setConversationTitle,
  setSelectedConversation,
} from "../redux/conversationSlice.js";
import { updateConversation } from "../features/updateConversation.js";

const ChatInput = () => {
  const [value, setValue] = useState("");

  const dispatch = useDispatch();

  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);

  const handleSendMessage = async () => {
    let conversation = selectedConversation;

    if (!conversation) {
      const conv = await createConversation();
      dispatch(setSelectedConversation(conv));
      dispatch(addConversation(conv));
      conversation = conv;
    }

    if (conversation.title == "New Chat") {
      await updateConversation({
        id: conversation?._id,
        title: value.trim(),
      });

      dispatch(
        setConversationTitle({
          conversationId: conversation?._id,
          title: value.trim().slice(0, 30),
        }),
      );
    }

    const payload = {
      prompt: value.trim(),
      conversationId: conversation?._id,
    };

    dispatch(addMessage({ role: "user", content: value.trim() }));

    setValue("");

    const data = await sendMessage(payload);
    dispatch(addMessage({ role: "assistant", content: data }));
  };

  return (
    <div className="w-full shrink-0 overflow-hidden px-2 sm:px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">
        <textarea
          rows={3}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder="Ask Anything..."
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-200 border border-transparent transition-all duration-150 bg-transparent cursor-pointer">
              <Paperclip size={22} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-200 border border-transparent transition-all duration-150 bg-transparent cursor-pointer">
              <Mic size={22} />
            </button>
          </div>

          <button
            disabled={!value}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none text-slate-500 ${!value.trim() ? "hover:text-slate-500 cursor-not-allowed" : "hover:text-slate-100 cursor-pointer"}  transition-all duration-150`}
          >
            <SendHorizontal size={25} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
