"use client";
import React, { useEffect, useState } from "react";
import { MessageSquare, PanelLeftIcon, PenSquare, Plus } from "lucide-react";
import { getConversations } from "../features/getConversations";
import { useDispatch, useSelector } from "react-redux";
import {
  addConversation,
  setConversations,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { createConversation } from "../features/createConversation";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();

  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );

  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations();

      dispatch(setConversations(data));
    };

    getConv();
  }, []);

  const handleCreateConversation = async () => {
    const data = await createConversation();
    dispatch(addConversation(data));
  };

  return (
    <div className="fixed lg:static inset-y-0 left-0 z-50 w-67.5 h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06]">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">
          <div className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer">
            <PanelLeftIcon onClick={() => setCollapsed(true)} />
          </div>
          <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
            IntesaAI
            <span className="text-[8px] font-medium text-slate-400 uppercase bg-sky-500/5 border border-indigo-500/20 px-2 ml-2 py-0.5 rounded-full tracking-wide ">
              free
            </span>
          </span>
          <button
            onClick={handleCreateConversation}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
          >
            <PenSquare size={20} />
          </button>
        </div>

        <div className="px-4 pt-4 pb-1">
          <button
            onClick={handleCreateConversation}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white
            bg-linear-to-br from-sky-400 to-gray-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150"
          >
            <Plus size={15} />
            New Chat
          </button>
        </div>

        {conversations.length > 0 ? (
          <div className="px-5 text-center pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
            Recents
          </div>
        ) : (
          <div className="px-5 text-center pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
            No Recent Conversations
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {conversations.map((conv, i) => {
            const isActive = selectedConversation?._id === conv?._id;

            return (
              <div
                key={i}
                onClick={() => dispatch(setSelectedConversation(conv))}
                className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2 rounded-full border transition-colors duration-150 ${isActive ? "bg-sky-900/5 border-indigo-500/[0.18]" : "bg-transparent border-transparent"} `}
              >
                <span
                  className={`${isActive ? "text-white/90" : "text-white/50"} ml-3`}
                >
                  {conv?.title || "New Chat"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
