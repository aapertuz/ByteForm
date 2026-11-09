import Image from "next/image";
import Link from "next/link";
import { Geist } from "next/font/google";
import {
  ArrowRight,
  AudioLines,
  Check,
  Layers2,
  MessageCircle,
  MoveUpRight,
} from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { FormExperienceDemo } from "./landing/FormExperienceDemo";
import { LandingMotion } from "./landing/LandingMotion";
import styles from "./landing/landing.module.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-landing" });

function StartLink({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/new"
      className={`${styles.cta} ${light ? styles.ctaLight : ""}`}
    >
      Start now <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}

function Brand() {
  return (
    <Link href="/" className={styles.brand} aria-label="ByteForm home">
      <Image src="/logo-icon.svg" width={30} height={30} alt="" />
      byteform<span className={styles.brandPeriod}>.</span>
    </Link>
  );
}

export function GuestHomePage({ posts }: { posts: PostMeta[] }) {
  return (
    <LandingMotion className={`${geist.variable} ${styles.page}`}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>
      <header className={styles.header}>
        <Brand />
        <nav className={styles.nav} aria-label="Main navigation">
          <a href="#experiences">The experience</a>
          <a href="#how-it-works">How it works</a>
          <Link href="/blog">Journal</Link>
        </nav>
        <div className={styles.navActions}>
          <Link href="/auth/login" className={styles.signIn}>
            Log in
          </Link>
          <StartLink />
        </div>
      </header>
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <h1 id="hero-title">
              Less form.
              <br />
              More <span>human.</span>
            </h1>
            <p className={styles.heroDescription}>
              Great answers start with a real connection. Create forms people
              can fill in, chat with, or talk to.
            </p>
            <StartLink light />
            <p className={styles.heroNote}>
              Build your first form. No sign-up needed.
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
          id="experiences"
          className={styles.experiences}
          aria-labelledby="experience-title"
        >
          <div className={styles.sectionIntro} data-reveal>
            <h2 id="experience-title">
              People have a lot to say.
              <br />
              Give them a way.
            </h2>
            <p>
              From a quick check-in to the full story, make room for the way
              people naturally respond.
            </p>
          </div>
          <div className={styles.featureLayout} data-reveal>
            <div className={styles.photoPanel}>
              <Image
                src="/images/landing-landscape.jpg"
                alt="A quiet lake reflecting mountains in the evening light"
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
                className={styles.landscape}
              />
              <div className={styles.photoCaption}>
                <span>
                  Make a little space
                  <br />
                  for a better answer.
                </span>
                <span className={styles.photoMark}>b.</span>
              </div>
            </div>
            <div className={styles.featureList}>
              <article>
                <MessageCircle size={23} aria-hidden="true" />
                <div>
                  <h3>A conversation, not a questionnaire.</h3>
                  <p>
                    Let people type their answers in a familiar chat. One
                    question at a time, with room to express themselves.
                  </p>
                  <a href="#demo-chat">
                    Try the chat <MoveUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </article>
              <article>
                <AudioLines size={23} aria-hidden="true" />
                <div>
                  <h3>Some things are easier said.</h3>
                  <p>
                    A voice-first way to share the longer story. Less typing,
                    more of what people really mean.
                  </p>
                  <span className={styles.comingSoon}>
                    Voice forms · Coming soon
                  </span>
                </div>
              </article>
              <article>
                <Layers2 size={23} aria-hidden="true" />
                <div>
                  <h3>The classic. With a little more care.</h3>
                  <p>
                    For the times you just need a form. Thoughtful questions, a
                    clean layout, and a clear path to done.
                  </p>
                  <a href="#demo-classic">
                    Try a classic form{" "}
                    <MoveUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </article>
            </div>
          </div>
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

        {posts.length > 0 && (
          <section
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
            <Check size={14} aria-hidden="true" /> No sign-up needed to start
            building.
          </p>
        </section>
      </main>
      <footer className={styles.footer}>
        <Brand />
        <p>Ask well. Get closer.</p>
        <div>
          <Link href="/blog">Journal</Link>
          <a href="mailto:team@getbyteform.com">Get in touch</a>
          <span>© {new Date().getFullYear()} ByteForm</span>
        </div>
      </footer>
    </LandingMotion>
  );
}
