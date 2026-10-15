import { MessageSquare } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const Nav = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);

  return (
    <div className="h-20 flex items-center justify-center px-5 gap-2.5 bg-linear-to-b from-[#061e38] to-[#090a0f]">
      {selectedConversation && (
        <div>
          <div className="text-[16px] text-slate-400 font-semibold tracking-tight">
            {selectedConversation?.title || "New Chat"}
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;
