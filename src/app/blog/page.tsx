import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { PostMeta } from "@/features/blog/components/PostMeta";
import { JournalCta } from "@/features/blog/components/JournalCta";
import styles from "@/features/blog/components/journal.module.css";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Practical ideas for asking better questions, designing forms, and understanding your customers.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main
      id="journal-content"
      tabIndex={-1}
      className={styles.index}
      data-page-entrance="/blog"
    >
      <div className={styles.intro}>
        <h1>
          Better questions.
          <br />
          Closer connections.
        </h1>
        <p>
          Ideas and practical guides for asking well, designing thoughtful
          forms, and understanding the people who answer.
        </p>
      </div>
      {posts.length === 0 ? (
        <div className={styles.empty}>
          <h2>Good questions take time.</h2>
          <p>
            Our first articles are on their way. In the meantime, try a
            conversation of your own.
          </p>
          <Link href="/#how-it-works" className={styles.textLink}>
            Explore ByteForm <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              className={styles.post}
              key={post.slug}
            >
              <div className={styles.postBody}>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <PostMeta date={post.date} readTime={post.readTime} />
              </div>
              <span className={styles.readLink}>
                Read article <ArrowRight size={19} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      )}
      <JournalCta />
    </main>
  );
}
