export function scrollToElement(element: HTMLElement) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({
    behavior: reducedMotion ? "instant" : "smooth",
    block: "start",
  });
}
