import React from "react";

export function PrimaryBtn({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] disabled:opacity-50 ${props.className ?? ""}`}
      style={{
        background: "var(--gradient-hero)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      {children}
    </button>
  );
}
