import React from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import LoadingAnimation from "./LoadingAnimation";

const MessageList = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.message);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-3 sm:px-6 py-6 space-y-5 scrollbar-thin scrollbar-thumb-slate-700/60 scrollbar-thumb-rounded-full">
      {messages.length == 0 || !selectedConversation ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[56px] sm:text-[72px] lg:text-[100px] font-semibold text-sky-200 opacity-30 blur-[1.5px] tracking-tight">
              IntesaAI
            </h1>
            <p className="text-[16px] sm:text-[20px] text-slate-400 blur-[0.5px] leading-relaxed">
              Hi {userData?.name.split(" ")[0]}, How can I help you?
            </p>
            <p className="text-[16px] sm:text-[20px] text-slate-700 leading-relaxed">
              Ask me anything - code, ideas, explanations, or just a quick
              question.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {["Build Netflix Clone", "Explain Javascript", "How are you?"].map(
              (s) => (
                <button className="text-[12px] text-slate-400 bg-sky-200/[0.1] border border-white/[0.07] px-3 py-1.5 rounded-lg hover:bg-sky-200/[0.12] hover:text-slate-200 transition-colors duration-150 cursor-pointer">
                  {s}
                </button>
              ),
            )}
          </div>
        </div>
      ) : (
        <div>
          {messages.map((msg, i) => (
            <div className="mb-4" key={i}>
              <MessageBubble
                role={msg?.role}
                content={msg?.content}
                images={msg?.images || []}
              />
            </div>
          ))}
          {isLoading && <LoadingAnimation />}
        </div>
      )}
    </div>
  );
};

export default MessageList;
