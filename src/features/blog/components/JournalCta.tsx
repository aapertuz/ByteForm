import { StartLink } from "@/shared/components/site/StartLink";
import styles from "./journal.module.css";

export function JournalCta() {
  return (
    <section className={styles.ctaPanel} aria-labelledby="journal-cta-title">
      <div>
        <h2 id="journal-cta-title">Put a good question to work.</h2>
        <p>Make your first form. No sign-up needed to start.</p>
      </div>
      <StartLink light />
    </section>
  );
}
