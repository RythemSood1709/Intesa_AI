"use client";
import {
  Code2,
  Copy,
  Eye,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";

const Artifact = () => {
  const { artifacts } = useSelector((state) => state.message);

  const [tab, setTab] = useState("code");
  const [collapsed, setCollapsed] = useState(false);
  const [activeFile, setActiveFile] = useState(0);

  if (artifacts.length === 0) return;

  const file = artifacts[0]?.files[activeFile]?.content;
  const htmlFile = artifacts[0]?.files?.find((f) => f.name === "index.html");

  const cssFile = artifacts[0]?.files?.find((f) => f.name === "style.css");

  const jsFile = artifacts[0]?.files?.find((f) => f.name === "script.js");

  const canPreview = Boolean(htmlFile);

  const previewDoc = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            ${cssFile?.content || ""}
          </style>
        </head>
        <body>
        ${htmlFile?.content || ""}
          <script>
            ${jsFile?.content || ""}
          </script>
        </body>
      </html>
      `;

  return (
    <motion.div
      initial={{ width: 350 }}
      animate={{ width: collapsed ? 48 : 350 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="hidden lg:flex h-full border-1 border-white/[0.06] flex-col overflow-hidden shrink-0 w-[250px]"
    >
      {!collapsed ? (
        <div className="flex flex-col h-full bg-linear-to-br from-[#050608] to-[#0b1324]">
          <div className="h-14 px-4 border-b border-white/[0.06] flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={() => setCollapsed(true)}
              className="flex items-center gap-5 justify-between w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
            >
              <PanelRightClose size={20} />
            </button>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="text-[13px] font-medium text-sky-600 blur-[0.3px] tracking-tight uppercase truncate">
                {artifacts[0]?.title}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer">
                <Copy size={15} />
              </button>
            </div>

            {canPreview && (
              <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg">
                <button
                  onClick={() => setTab("code")}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-colors duration-150
                ${tab === "code" ? "bg-sky-500/20 text-white" : "text-slate-400 hover:text-slate-200"}`}
                >
                  <Code2 size={13} />
                  Code
                </button>
                <button
                  onClick={() => setTab("preview")}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-colors duration-150
                ${tab === "preview" ? "bg-sky-500/20 text-white" : "text-slate-400 hover:text-slate-200"}`}
                >
                  <Eye size={13} />
                  Preview
                </button>
              </div>
            )}
          </div>
          {tab == "code" && (
            <div className="flex border-b h-auto border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
              {artifacts[0]?.files?.map((f, index) => (
                <button
                  onClick={() => setActiveFile(index)}
                  className={`px-4 h-auto py-2.5 text-[12px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/[0.06] relative cursor-pointer bg-transparent ${activeFile === index ? "text-sky-400/70 bg-white/[0.01]" : "text-slate-500 hover:text-slate-300 "}  `}
                  key={index}
                >
                  {f?.name}
                  {activeFile === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-500 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            {tab == "preview" && canPreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <iframe
                  title="preview"
                  srcDoc={previewDoc}
                  className="w-full h-full bg-white"
                  sanbox="allow scripts"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{}}
                animate={{}}
                transition={{}}
              ></motion.div>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => setCollapsed(false)}
          className="flex flex-col items-center h-full bg-linear-to-br from-[#090a0f] to-[#0d1628] cursor-ew-resize"
        >
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center gap-5 justify-between w-7 h-7 mt-4 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
          >
            <PanelRightOpen size={24} />
          </button>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
              }}
              className="text-[10px] font-medium text-sky-600 blur-[0.5px] tracking-widest uppercase whitespace-nowrap"
            >
              {artifacts[0]?.title}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Artifact;
