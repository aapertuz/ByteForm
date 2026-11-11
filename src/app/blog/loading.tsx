import styles from "@/features/blog/components/journal.module.css";

export default function BlogLoading() {
  return (
    <main
      id="journal-content"
      className={styles.index}
      tabIndex={-1}
      aria-busy="true"
    >
      <p role="status" className="sr-only">
        Loading articles…
      </p>
      <div aria-hidden="true">
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={`${styles.skeleton} ${styles.skeletonText}`} />
        {[0, 1, 2].map((row) => (
          <div className={styles.skeletonRow} key={row}>
            <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
            <div className={`${styles.skeleton} ${styles.skeletonText}`} />
            <div className={`${styles.skeleton} ${styles.skeletonText}`} />
          </div>
        ))}
      </div>
    </main>
  );
}
