import Link from "next/link";
import { brandFont } from "@/shared/styles/fonts";
import { BrandLink } from "@/shared/components/site/BrandLink";
import { StartLink as SharedStartLink } from "@/shared/components/site/StartLink";
import {
  ArrowRight,
  Check,
  Layers2,
} from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { FormExperienceDemo } from "./landing/FormExperienceDemo";
import { CreationPrompt } from "./landing/CreationPrompt";
import { LandingMotion } from "./landing/LandingMotion";
import styles from "./landing/landing.module.css";
import { PricingSection } from "@/features/pricing/PricingSection";
import { SectionLink } from "./landing/SectionLink";

function StartLink({ light = false }: { light?: boolean }) {
  return <SharedStartLink light={light} className={`${styles.cta} ${light ? styles.ctaLight : ""}`} />;
}

function Brand() {
  return <BrandLink className={styles.brand} />;
}

export function GuestHomePage({ posts }: { posts: PostMeta[] }) {
  return (
    <LandingMotion className={`${brandFont.variable} ${styles.page}`}>
      <SectionLink href="#main-content" className={styles.skipLink}>
        Skip to content
      </SectionLink>
      <header className={styles.header}>
        <Brand />
        <nav className={styles.nav} aria-label="Main navigation">
          <SectionLink href="#how-it-works">How it works</SectionLink>
          <SectionLink href="#pricing">Pricing</SectionLink>
          {posts.length > 0 ? <SectionLink href="#journal">Journal</SectionLink> : <Link href="/blog">Journal</Link>}
        </nav>
        <div className={styles.navActions}>
          <Link href="/auth/login" className={styles.signIn}>
            Log in
          </Link>
          <StartLink />
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <h1 id="hero-title">
              Less form.
              <br />
              More <span>human.</span>
            </h1>
            <p className={styles.heroDescription}>
              Know your customers with real conversations.
              <br />
              Create forms people can fill in, chat with, or talk to.
            </p>
            <CreationPrompt />
            <p className={styles.heroNote}>
              Describe your form. Make it yours.
            </p>
          </div>
          <div className={styles.heroDemo}>
            <FormExperienceDemo />
          </div>
        </section>

        <section className={styles.customers} aria-labelledby="customer-title">
          <p id="customer-title">Good company. Great conversations.</p>
          <div
            className={styles.logoRow}
            aria-label="Placeholder customer companies"
          >
            <span className={styles.customerLogo}>
              <Layers2 aria-hidden="true" />
              Layers
            </span>
            <span className={styles.customerLogo}>⌘ quotient</span>
            <span className={styles.customerLogo}>
              <span className={styles.circledLogo}>C</span> Circooles
            </span>
            <span className={styles.customerLogo}>
              <span className={styles.hourglassLogo}>H</span> hourglass
            </span>
            <span className={styles.customerLogo}>
              Sisyphus<span aria-hidden="true"> ↗</span>
            </span>
          </div>
          <small>Placeholder companies. Your customers belong here.</small>
        </section>

        <section
          id="how-it-works"
          className={styles.howItWorks}
          aria-labelledby="how-title"
        >
          <div data-reveal>
            <h2 id="how-title">
              Less setting up.
              <br />
              More finding out.
            </h2>
            <StartLink />
          </div>
          <ol className={styles.steps} data-reveal>
            <li>
              <span>01</span>
              <div>
                <h3>Make it yours.</h3>
                <p>
                  Write your questions. Set the tone. Build a form that feels
                  like your brand.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Send it out.</h3>
                <p>
                  Share a single link. Give people a simple way to answer,
                  wherever they are.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Get the whole picture.</h3>
                <p>
                  Bring responses together, review what people said, and decide
                  what comes next.
                </p>
              </div>
            </li>
          </ol>
        </section>



        <section id="pricing" className={styles.pricing} aria-labelledby="pricing-title">
          <PricingSection />
        </section>



        {posts.length > 0 && (
          <section
            id="journal"
            className={styles.journal}
            aria-labelledby="journal-title"
            data-reveal
          >
            <div className={styles.journalHeading}>
              <div>
                <h2 id="journal-title">Better questions start here.</h2>
              </div>
              <Link href="/blog" className={styles.textLink}>
                All articles <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className={styles.articles}>
              {posts.map((post) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                  className={styles.article}
                >
                  <span>
                    {post.tags[0] || "Perspectives"}{" "}
                    <span> / {post.readTime} min read</span>
                  </span>
                  <h3>{post.title}</h3>
                  <span className={styles.articleArrow}>
                    <ArrowRight size={22} aria-hidden="true" />
                    <span className="sr-only">Read article</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section
          className={styles.finalCta}
          aria-labelledby="cta-title"
          data-reveal
        >
          <h2 id="cta-title">
            It starts with
            <br />a good question.
          </h2>
          <StartLink light />
          <p>
            <Check size={14} aria-hidden="true" /> Start with an idea. We’ll take it from there.
          </p>
        </section>
      </main>
      <footer className={styles.footer}>
        <Brand />
        <p>Ask well. Get closer.</p>
        <div>
          {posts.length > 0 ? <SectionLink href="#journal">Journal</SectionLink> : <Link href="/blog">Journal</Link>}
          <a href="mailto:team@getbyteform.com">Get in touch</a>
          <span>© {new Date().getFullYear()} ByteForm</span>
        </div>
      </footer>
    </LandingMotion>
  );
}
