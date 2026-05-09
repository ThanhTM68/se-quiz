import React from "react";

export default function QuestionContent({ text, className = "" }) {
    if (typeof text !== "string" || !text.trim()) {
        return null;
    }

    const [introLine, ...codeLines] = text.split("\n");

    if (codeLines.length === 0) {
        return <p className={className}>{text}</p>;
    }

    return (
        <div className={className}>
            <p>{introLine}</p>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-slate-950/70 p-4 font-mono text-sm leading-6 text-slate-100 whitespace-pre-wrap">
                {codeLines.join("\n")}
            </pre>
        </div>
    );
}
