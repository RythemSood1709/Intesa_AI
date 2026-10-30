"use client";
import { Check, Copy, ExternalLink, X } from "lucide-react";
import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MessageBubble = ({ role, content, images }) => {
  const isUser = role === "user";

  const [lightBox, setLightBox] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode("");
    }, 2000);
  };

  return (
    <div className={`flex mx-5 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit px-4 py-2.5 rounded-2xl text-[14.5px] leading-relaxed overflow-hidden
      ${
        isUser
          ? "bg-linear-to-br mt-10 from-sky-400 to-gray-700 text-white max-w-[50%] rounded-tr-sm"
          : " text-slate-200 rounded-tl-sm"
      }
      `}
      >
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mt-5 mb-3">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mt-4 mb-2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold mt-3 mb-2">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-3 whitespace-pre-wrap break-words">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc marker:text-white pl-5 space-y-1 my-2">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal marker:text-white pl-5 space-y-1 my-2">
                {children}
              </ol>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-white/10">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-white/10 bg-white/5 px-3 py-2 text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-white/10 px-3 py-2">{children}</td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline inline-flex flex-wrap items-center gap-1"
              >
                {children}
                <ExternalLink size={14} />
              </a>
            ),
            img: ({ src, alt }) => (
              <img
                src={src}
                onClick={() => setLightBox(src)}
                alt={alt || "Generated image"}
                loading="lazy"
                className="max-w-full w-[min(640px,80vw)] rounded-xl border border-white/10 object-contain"
              />
            ),
            code: ({ className, children }) => {
              const value = String(children).trim();

              if (!className) {
                return (
                  <code className="px-1.5 py-0.5 bg-white/10 text-pink-400">
                    {value}
                  </code>
                );
              }

              const language = className?.replace("language-", "");

              return (
                <div className="my-4 overflow-visible rounded-xl border border-white/10 bg-[#111318]">
                  <div className="relative z-20 flex items-center justify-between overflow-visible rounded-t-xl bg-[#1b1d24] border-b border-white/10 px-4 py-2">
                    <span className="uppercase text-xs text-slate-400">
                      {language}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyCode(value)}
                      aria-label={copiedCode === value ? "Copied" : "Copy"}
                      className="group relative flex items-center gap-1 text-xs"
                    >
                      {copiedCode === value ? (
                        <>
                          <Check size={14} />
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/80 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-90 group-focus-visible:opacity-100"
                          >
                            Copied
                          </span>
                        </>
                      ) : (
                        <>
                          {" "}
                          <Copy size={14} />
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/80 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-90 group-focus-visible:opacity-100"
                          >
                            Copy
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  <SyntaxHighlighter
                    style={oneDark}
                    wrapLongLines
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: "16px",
                      background: "#0d1117",
                      fontSize: "13px",
                    }}
                    language={language}
                  >
                    {value}
                  </SyntaxHighlighter>
                </div>
              );
            },
          }}
        >
          {content}
        </Markdown>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Search result ${i + 1}`}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                onClick={() => setLightBox(img)}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
              />
            ))}
          </div>
        )}
      </div>

      {lightBox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <button
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
            onClick={() => setLightBox(null)}
          >
            <X />
          </button>
          <img
            src={lightBox}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
            alt=""
          />
          <img />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
