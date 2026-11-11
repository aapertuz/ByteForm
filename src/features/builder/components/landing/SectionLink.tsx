"use client";

import type { MouseEvent, ReactNode } from "react";
import { scrollToElement } from "@/shared/lib/scroll-to-element";

export function SectionLink({
  href,
  children,
  className,
}: {
  href: `#${string}`;
  children: ReactNode;
  className?: string;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById(href.slice(1));
    if (!section) return;

    event.preventDefault();
    if (window.location.hash !== href) {
      window.history.pushState(null, "", href);
    }
    section.focus({ preventScroll: true });
    scrollToElement(section);
  }

  return <a href={href} className={className} onClick={handleClick}>{children}</a>;
}
