import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { brandFont } from "@/shared/styles/fonts";
import { BrandLink } from "@/shared/components/site/BrandLink";
import { LoginForm } from "@/features/auth/components/LoginForm";
import site from "@/shared/components/site/site.module.css";
import styles from "@/features/auth/components/auth.module.css";

type LoginPageProps = {
  searchParams: Promise<{ mode?: string | string[] }>;
};

export async function generateMetadata({
  searchParams,
}: LoginPageProps): Promise<Metadata> {
  const { mode } = await searchParams;
  return {
    title: mode === "signup" ? "Create an account" : "Log in",
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { mode } = await searchParams;
  const isSignUp = mode === "signup";
  return (
    <div className={`${brandFont.variable} ${site.surface} ${styles.page}`}>
      <a href="#auth-content" className={site.skipLink}>
        Skip to content
      </a>
      <header className={styles.header}>
        <BrandLink />
        <Link href="/" className={styles.back}>
          <ArrowLeft size={15} aria-hidden="true" /> Back to home
        </Link>
      </header>
      <main className={styles.main} id="auth-content" tabIndex={-1}>
        <aside className={styles.aside}>
          <h2>
            Less form.
            <br />
            More human.
          </h2>
          <p>
            Make space for better conversations. Create forms that help you
            understand the people who matter to your work.
          </p>
          <ul>
            <li>
              <Check size={17} aria-hidden="true" /> Make your form your own.
            </li>
            <li>
              <Check size={17} aria-hidden="true" /> Share it with a single
              link.
            </li>
            <li>
              <Check size={17} aria-hidden="true" /> Bring every response
              together.
            </li>
          </ul>
        </aside>
        <div className={styles.formPanel} data-page-entrance="/auth/login">
          <LoginForm key={isSignUp ? "signup" : "login"} isSignUp={isSignUp} />
        </div>
      </main>
    </div>
  );
}
