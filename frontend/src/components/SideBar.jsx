"use client";
import React, { useEffect, useState } from "react";
import {
  IndianRupee,
  LogOut,
  MessageSquare,
  PanelLeftIcon,
  PanelRightIcon,
  PenSquare,
  Plus,
  UserIcon,
} from "lucide-react";
import { getConversations } from "../features/getConversations";
import { useDispatch, useSelector } from "react-redux";
import {
  addConversation,
  setConversations,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { createConversation } from "../features/createConversation";
import logOut from "../features/logOut";
import { setUserData } from "../redux/userSlice";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);

  const dispatch = useDispatch();

  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );

  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations();

      dispatch(setConversations(data));
    };

    getConv();
  }, [userData?._id]);

  const handleCreateConversation = async () => {
    const data = await createConversation();
    dispatch(addConversation(data));
  };

  return (
    <div
      onClick={collapsed ? () => setCollapsed(false) : undefined}
      className={`fixed lg:static inset-y-0 left-0 z-50 h-screen shrink-0 overflow-hidden border-r border-white/[0.06] transition-[width] duration-200 ease-in-out ${
        collapsed
          ? "hidden lg:flex w-[56px] flex-col items-center cursor-ew-resize bg-linear-to-br from-[#090a0f] to-[#0d1628] bg-[#090a0f]"
          : "w-67.5 bg-linear-to-br from-[#050608] to-[#0b1324]"
      }`}
    >
      {collapsed ? (
        <div className="flex flex-col items-center h-full py-4 gap-1">
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
          >
            <PanelRightIcon />
          </button>

          <button
            onClick={handleCreateConversation}
            className="flex items-center justify-center mt-5 w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
          >
            <Plus size={20} />
          </button>

          <div className="mt-auto">
            {userData ? (
              <div className="relative shrink-0 flex flex-col items-center gap-4">
                <div>
                  {userData?.avatar || imageError ? (
                    <img
                      className="w-9 h-9 rounded-full object-cover border-2 border-sky-500/15"
                      src={userData?.avatar}
                      alt="image"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-2xl bg-white/[0.06] flex items-center justify-center">
                      <UserIcon size={15} className="text-slate-400" />
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => {
                      logOut();
                      dispatch(setUserData(null));
                    }}
                    className="flex items-center justify-center w-6 h-6 rounded-[7px] border-none bg-transparent text-slate-500 cursor-pointer hover:bg-white/[0.08] hover:text-slate-200 transition-all duration-150"
                  >
                    <LogOut size={22} />
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full">
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
                      className={`${isActive ? "text-white/90" : "text-white/50"} ml-3 text-[16px]`}
                    >
                      {conv?.title || "New Chat"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mx-2.5 h-px bg-white/[0.08]" />

            <div className="px-3.5 py-3.5 pt-1.5">
              {userData ? (
                <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-3 hover:bg-white/[0.05] transition-colors duration-150">
                  <div className="relative shrink-0">
                    {userData?.avatar || imageError ? (
                      <img
                        className="w-11 h-11 rounded-full object-cover border-2 border-sky-500/15"
                        src={userData?.avatar}
                        alt="image"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-2xl bg-white/[0.06] flex items-center justify-center">
                        <UserIcon size={15} className="text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-slate-100 truncate">
                      {userData?.name || "user"}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-px">
                      {"Free Plan"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button className="flex items-center justify-center w-6 h-6 rounded-[7px] border-none bg-transparent text-emerald-700 cursor-pointer hover:bg-white/[0.08] hover:text-orange-600 transition-all duration-150">
                      <IndianRupee size={22} />
                    </button>
                    <button
                      onClick={() => {
                        logOut();
                        dispatch(setUserData(null));
                      }}
                      className="flex items-center justify-center w-6 h-6 rounded-[7px] border-none bg-transparent text-slate-500 cursor-pointer hover:bg-white/[0.08] hover:text-slate-200 transition-all duration-150"
                    >
                      <LogOut size={22} />
                    </button>
                  </div>
                </div>
              ) : (
                <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-[11px] cursor-pointer hover:bg-white/[0.08] transition-colors duration-150 ">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
