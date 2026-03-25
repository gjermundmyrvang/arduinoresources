"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import type { CSSProperties } from "react";

type Props = {
  content: string;
  className?: string;
};

const syntaxStyle = oneDark as { [key: string]: CSSProperties };

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-all duration-75"
      style={{
        background: copied ? "#1a3a1a" : "#1a1a2e",
        border: copied ? "1px solid #2a5a2a" : "1px solid #2a2a4a",
        color: copied ? "#4f8" : "#4af",
        textShadow: copied
          ? "0 0 4px rgba(80,255,80,0.5)"
          : "0 0 4px rgba(80,180,255,0.5)",
        borderRadius: "2px",
      }}
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? "copied" : "copy"}
    </button>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="relative group">
      <div
        className="absolute top-2 left-3 font-mono text-[9px] uppercase tracking-widest opacity-40"
        style={{ color: "#4af" }}
      >
        {language}
      </div>
      <CopyButton code={code} />
      <SyntaxHighlighter
        style={syntaxStyle}
        language={language}
        PreTag="div"
        customStyle={{ paddingTop: "2rem" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function RenderMarkdown({ content, className }: Props) {
  return (
    <div className={className ?? "prose prose-neutral max-w-none mt-6"}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");

            if (match) {
              return <CodeBlock language={match[1]} code={code} />;
            }

            return (
              <code
                className="bg-neutral-100 px-1 py-0.5 font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
