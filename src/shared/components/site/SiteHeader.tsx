import Link from "next/link";
import { BrandLink } from "./BrandLink";
import { StartLink } from "./StartLink";
import styles from "./site.module.css";

export function SiteHeader({ journal = false }: { journal?: boolean }) {
  return (
    <header className={styles.header}>
      <BrandLink />
      <nav className={styles.navigation} aria-label="Main navigation">
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/#pricing">Pricing</Link>
        <Link href="/blog" aria-current={journal ? "page" : undefined}>
          Journal
        </Link>
      </nav>
      <div className={styles.actions}>
        <Link href="/auth/login" className={styles.login}>
          Log in
        </Link>
        <StartLink />
      </div>
    </header>
  );
}
