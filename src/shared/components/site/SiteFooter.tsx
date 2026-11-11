import Link from "next/link";
import { BrandLink } from "./BrandLink";
import styles from "./site.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <BrandLink />
      <p>Ask well. Get closer.</p>
      <nav aria-label="Footer navigation">
        <Link href="/blog">Journal</Link>
        <a href="mailto:team@getbyteform.com">Get in touch</a>
        <span>© {new Date().getFullYear()} ByteForm</span>
      </nav>
    </footer>
  );
}
