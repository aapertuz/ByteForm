import type { ReactNode } from "react";
import { brandFont } from "@/shared/styles/fonts";
import { SiteHeader } from "@/shared/components/site/SiteHeader";
import { SiteFooter } from "@/shared/components/site/SiteFooter";
import styles from "@/shared/components/site/site.module.css";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${brandFont.variable} ${styles.surface}`}>
      <a href="#journal-content" className={styles.skipLink}>
        Skip to content
      </a>
      <SiteHeader journal />
      {children}
      <SiteFooter />
    </div>
  );
}
