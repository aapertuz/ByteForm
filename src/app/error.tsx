"use client";

import Link from "next/link";
import { PageState } from "@/shared/components/site/PageState";
import site from "@/shared/components/site/site.module.css";
import styles from "@/shared/components/site/state.module.css";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageState
      title="Something didn’t load."
      description="Please try again. If the problem continues, get in touch and we’ll help you find your way."
    >
      <button type="button" className={site.cta} onClick={reset}>
        Try again
      </button>
      <Link href="/" className={styles.secondary}>
        Back to home
      </Link>
      <a href="mailto:team@getbyteform.com" className={styles.secondary}>
        Get in touch
      </a>
    </PageState>
  );
}
