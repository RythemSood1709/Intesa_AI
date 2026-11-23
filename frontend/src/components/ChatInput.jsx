"use client";
import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  Paperclip,
  Presentation,
  SendHorizontal,
  X,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import sendMessage from "../features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setArtifacts } from "../redux/messageSlice";

import { createConversation } from "../features/createConversation.js";
import {
  addConversation,
  setConversationTitle,
  setSelectedConversation,
} from "../redux/conversationSlice.js";
import { updateConversation } from "../features/updateConversation.js";
import { useRef } from "react";

const ChatInput = () => {
  const [value, setValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef(null);

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

    console.log(selectedFile);
    const formData = new FormData();

    formData.append("prompt", value.trim());
    formData.append("conversationId", conversation?._id);
    formData.append("agent", selectedAgent.toLowerCase());
    formData.append("file", selectedFile);

    dispatch(addMessage({ role: "user", content: value.trim() }));

    setValue("");

    const data = await sendMessage(formData);
    setSelectedFile(null);
    dispatch(setArtifacts(data?.artifacts || []));
    dispatch(
      addMessage({
        role: "assistant",
        content: data?.answer,
        images: data?.images,
      }),
    );
  };

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
    },
    {
      id: "search",
      icon: Globe,
      label: "Search",
    },
    {
      id: "coding",
      icon: Code2,
      label: "Coding",
    },
    {
      id: "pdf",
      icon: FileText,
      label: "PDF",
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT",
    },
    {
      id: "image",
      icon: ImageIcon,
      label: "Image",
    },
  ];

  return (
    <div className="w-full rounded-xl shrink-0 overflow-hidden px-2 sm:px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]">
      <div className="flex sm:w-[80%] gap-0.5 sm:gap-2 sm:pr-2 flex-wrap mb-4 ">
        {agents.map((agent) => {
          const isActive = selectedAgent === agent.label;
          const Icon = agent.icon;

          return (
            <button
              key={agent.id}
              type="button"
              aria-label={agent.label}
              title={agent.label}
              onClick={() => setSelectedAgent(agent.label)}
              className={`group relative flex shrink-0 inline-flex flex-col md:flex-row items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                isActive
                  ? "bg-linear-to-r from-sky-300/[0.2] to-gray-800 text-white border-transparent shadow-[0_1px_8px_rgba(99, 102, 241, .35)]"
                  : "bg-transparent border-transparent text-slate-400 hover:bg-white/[0.05]"
              }`}
            >
              <Icon size={16} />
              <span className="md:hidden text-[7px]">{agent.label}</span>
              <span
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/80 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-90 group-focus-visible:opacity-100 md:block"
              >
                {agent.label}
              </span>
            </button>
          );
        })}
      </div>
      {selectedFile && (
        <div className="my-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
            {selectedFile?.type === "application/pdf" ? (
              <FileText size={16} className="text-red-400" />
            ) : (
              selectedFile?.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  className="h-10 w-10 rounded-xl object-cover"
                />
              )
            )}
            <div>
              <p
                className="md:max-w-[200px] max-w-[140px] truncate text-xs text-white"
                title={selectedFile?.name}
              >
                {selectedFile?.name}
              </p>
              <p className="text-[10px] text-slate-500">
                {(selectedFile?.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button className="ml-1">
              <X
                size={14}
                onClick={() => {
                  setSelectedFile(null);
                  fileRef.current.value = "";
                }}
                className="text-slate-500 hover:text-white"
              />
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3.5">
        <textarea
          rows={2}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder="Ask Anything..."
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
        />
        <button
          disabled={!value}
          onClick={handleSendMessage}
          className={`flex items-center justify-center w-8 h-8 rounded-lg border-none text-slate-500 ${!value.trim() ? "hover:text-slate-500 cursor-not-allowed" : "hover:text-slate-100 cursor-pointer"}  transition-all duration-150`}
        >
          <SendHorizontal size={25} />
        </button>
      </div>
      <div className="flex mt-2 items-center justify-between">
        <div className="flex items-center gap-1">
          <input
            type="file"
            accept=".pdf, image/*"
            hidden
            ref={fileRef}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedFile(file);
              }
            }}
          />
          <button
            onClick={() => fileRef.current.click()}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-200 border border-transparent transition-all duration-150 bg-transparent cursor-pointer"
          >
            <Paperclip size={22} />
          </button>
          <button className="flex items-center justify-centesr w-8 h-8 rounded-lg text-slate-600 hover:text-slate-200 border border-transparent transition-all duration-150 bg-transparent cursor-pointer">
            <Mic size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
