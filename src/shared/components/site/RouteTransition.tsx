"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Enhances committed routes without delaying navigation or remounting page state. */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef(false);
  const historyRef = useRef(false);
  const animationRef = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    function onKeyDown() {
      keyboardRef.current = true;
      animationRef.current?.cancel();
    }
    function onPointerDown() {
      keyboardRef.current = false;
    }
    function onPopState() {
      historyRef.current = true;
    }
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    function onPreferenceChange() {
      if (preference.matches) animationRef.current?.cancel();
    }
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("popstate", onPopState);
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("popstate", onPopState);
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const isHistoryNavigation = historyRef.current;
    historyRef.current = false;
    if (
      !container ||
      pathname === "/" ||
      keyboardRef.current ||
      isHistoryNavigation ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    function enter(target: HTMLElement, move: boolean) {
      if (
        keyboardRef.current ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        typeof target.animate !== "function"
      )
        return;

      // Only move explicitly marked content; transforming the app would re-anchor fixed UI.
      animationRef.current = target.animate(
        move
          ? [
              { opacity: 0.45, transform: "translateY(10px)" },
              { opacity: 1, transform: "translateY(0)" },
            ]
          : [{ opacity: 0.65 }, { opacity: 1 }],
        {
          duration: move ? 420 : 200,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        },
      );
    }

    function findContent() {
      return Array.from(
        container!.querySelectorAll<HTMLElement>("[data-page-entrance]"),
      ).find(
        (element) =>
          (element.dataset.pageEntrance === pathname ||
            element.dataset.pageEntrance === "true") &&
          !element.closest("[hidden]"),
      );
    }

    const content = findContent();
    let observer: MutationObserver | undefined;
    if (content) {
      enter(content, true);
    } else if (pathname.startsWith("/blog") || pathname === "/auth/login") {
      // Streaming may commit a loading boundary before the destination content arrives.
      observer = new MutationObserver(() => {
        const destination = findContent();
        if (!destination) return;
        observer?.disconnect();
        enter(destination, true);
      });
      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["hidden", "data-page-entrance"],
      });
    } else {
      enter(container, false);
    }
    return () => {
      observer?.disconnect();
      animationRef.current?.cancel();
    };
  }, [pathname]);

  return (
    <div ref={containerRef} className="min-h-full shrink-0">
      {children}
    </div>
  );
}
