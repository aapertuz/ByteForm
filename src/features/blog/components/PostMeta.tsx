import styles from "./journal.module.css";

export function PostMeta({
  date,
  readTime,
}: {
  date: string;
  readTime: number;
}) {
  const formatted = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return (
    <div className={styles.meta}>
      <time dateTime={date}>{formatted}</time>
      <span aria-hidden="true">/</span>
      <span>{readTime} min read</span>
    </div>
  );
}
