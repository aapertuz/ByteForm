import Link from "next/link";
import type { ReactNode } from "react";
import { brandFont } from "@/shared/styles/fonts";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import site from "./site.module.css";
import styles from "./state.module.css";

export function PageState({
  title,
  description,
  children,
  embedded = false,
}: {
  title: string;
  description: string;
  children?: ReactNode;
  embedded?: boolean;
}) {
  const content = (
    <main
      id={embedded ? "journal-content" : "page-content"}
      tabIndex={-1}
      className={styles.content}
      data-page-entrance
    >
      <h1>{title}</h1>
      <p>{description}</p>
      <div className={styles.actions}>
        {children ?? (
          <Link href="/" className={site.cta}>
            Back to home
          </Link>
        )}
      </div>
    </main>
  );
  if (embedded) return content;
  return (
    <div className={`${brandFont.variable} ${site.surface}`}>
      <a href="#page-content" className={site.skipLink}>
        Skip to content
      </a>
      <SiteHeader />
      {content}
      <SiteFooter />
    </div>
  );
}
