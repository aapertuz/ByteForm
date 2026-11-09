"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Enhances server-rendered content; everything stays visible without JavaScript. */
export function LandingMotion({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!page || motionPreference.matches || !("IntersectionObserver" in window))
      return;

    const sections = page.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) return;
          target.setAttribute("data-reveal", "visible");
          observer.unobserve(target);
        });
      },
      { rootMargin: "0px 0px -24px 0px", threshold: 0 },
    );

    sections.forEach((section) => {
      // Never hide content already on screen, including restored scroll positions.
      if (section.getBoundingClientRect().top < window.innerHeight) return;
      section.dataset.reveal = "pending";
      observer.observe(section);
    });

    function revealAll() {
      if (!motionPreference.matches) return;
      observer.disconnect();
      sections.forEach((section) => {
        section.dataset.reveal = "visible";
      });
    }

    motionPreference.addEventListener("change", revealAll);
    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", revealAll);
      sections.forEach((section) => {
        section.dataset.reveal = "visible";
      });
    };
  }, []);

  return (
    <div ref={pageRef} className={className}>
      {children}
    </div>
  );
}
