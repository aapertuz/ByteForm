import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PostMeta } from "@/features/blog/components/PostMeta";
import { JournalCta } from "@/features/blog/components/JournalCta";
import styles from "@/features/blog/components/journal.module.css";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/blog";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return { robots: { index: false, follow: false } };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://byteform.io";

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${siteUrl}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://byteform.io";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    publisher: {
      "@type": "Organization",
      name: "ByteForm",
      url: siteUrl,
    },
    url: `${siteUrl}/blog/${slug}`,
  };

  const relatedPosts = getAllPosts()
    .filter((entry) => entry.slug !== slug)
    .slice(0, 2);

  return (
    <main
      id="journal-content"
      tabIndex={-1}
      className={styles.articlePage}
      data-page-entrance={`/blog/${slug}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Link href="/blog" className={styles.textLink}>
        <ArrowLeft size={16} aria-hidden="true" /> All articles
      </Link>
      <article>
        <header className={styles.articleHeader}>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
          <PostMeta date={post.date} readTime={post.readTime} />
        </header>
        <div className={styles.prose}>
          <MDXRemote source={post.content} />
        </div>
      </article>
      {relatedPosts.length > 0 && (
        <section className={styles.related} aria-labelledby="related-title">
          <h2 id="related-title">Keep exploring.</h2>
          <div className={styles.posts}>
            {relatedPosts.map((entry) => (
              <Link
                key={entry.slug}
                href={`/blog/${entry.slug}`}
                className={styles.post}
              >
                <div className={styles.postBody}>
                  <h3>{entry.title}</h3>
                  <PostMeta date={entry.date} readTime={entry.readTime} />
                </div>
                <span className={styles.readLink}>
                  Read article <ArrowRight size={19} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <JournalCta />
    </main>
  );
}
