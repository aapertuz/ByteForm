import Link from "next/link";
import { PageState } from "@/shared/components/site/PageState";
import styles from "@/shared/components/site/site.module.css";

export default function ArticleNotFound() {
  return (
    <PageState
      embedded
      title="We couldn’t find that article."
      description="The link may have changed. There are more ideas and guides waiting in the journal."
    >
      <Link href="/blog" className={styles.cta}>
        All articles
      </Link>
    </PageState>
  );
}
