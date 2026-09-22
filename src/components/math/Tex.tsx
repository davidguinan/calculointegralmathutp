import katex from "katex";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function Tex({ children, className }: { children: string; className?: string }) {
  const html = useMemo(
    () => katex.renderToString(children, { throwOnError: false, displayMode: false }),
    [children],
  );
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function TexBlock({
  children,
  className,
  boxed = false,
}: {
  children: string;
  className?: string;
  boxed?: boolean;
}) {
  const html = useMemo(
    () => katex.renderToString(children, { throwOnError: false, displayMode: true }),
    [children],
  );
  return (
    <div
      className={cn(
        "overflow-x-auto py-2 text-foreground",
        boxed && "rounded-lg border border-border bg-muted/60 px-4 py-3",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
