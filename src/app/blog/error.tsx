"use client";

import Link from "next/link";
import { PageState } from "@/shared/components/site/PageState";
import site from "@/shared/components/site/site.module.css";
import styles from "@/shared/components/site/state.module.css";

export default function BlogError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageState
      embedded
      title="The journal couldn’t load."
      description="Please try again in a moment. You can also return to ByteForm and keep exploring."
    >
      <button type="button" className={site.cta} onClick={reset}>
        Try again
      </button>
      <Link href="/" className={styles.secondary}>
        Back to home
      </Link>
    </PageState>
  );
}
