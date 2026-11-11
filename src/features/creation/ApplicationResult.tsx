import { ArrowRight, Check, Hourglass, PartyPopper } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";
import { submitApplication } from "./submit-application";
import styles from "./creation.module.css";

export function ApplicationResult({
  headingRef,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const websiteRef = useRef<HTMLInputElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (detailsOpen) websiteRef.current?.focus();
  }, [detailsOpen]);

  async function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await submitApplication("PATCH", {
        website: String(data.get("website") || ""),
        details: String(data.get("details") || ""),
      });
      setSaved(true);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "We couldn’t save your details. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.result}>
      <div className={styles.celebration} aria-hidden="true">
        <PartyPopper size={48} strokeWidth={1.4} />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <h1 id="application-title" ref={headingRef} tabIndex={-1}>
        Application sent!
      </h1>
      <p className={styles.waitlist}>
        <Hourglass size={16} aria-hidden="true" /> You’re on the waitlist
      </p>
      <p className={styles.resultCopy}>
        Due to high volume, we’re very selective about who we take on. If you’re
        selected, we’ll reach out with a <strong>custom quote.</strong> Add a
        few optional details next to improve your chances of being a great fit.
      </p>
      {!detailsOpen ? (
        <button
          type="button"
          className={styles.primary}
          onClick={() => setDetailsOpen(true)}
        >
          Improve my chances <ArrowRight size={17} aria-hidden="true" />
        </button>
      ) : saved ? (
        <p className={styles.detailsSaved} role="status">
          <Check size={18} aria-hidden="true" /> Your details have been added.
          Thank you!
        </p>
      ) : (
        <form className={styles.details} onSubmit={saveDetails}>
          <label htmlFor="application-website">
            Company website <span>(optional)</span>
          </label>
          <input
            id="application-website"
            ref={websiteRef}
            name="website"
            type="url"
            placeholder="https://your-company.com"
            maxLength={500}
          />
          <label htmlFor="application-details">
            What would you like to build? <span>(optional)</span>
          </label>
          <textarea
            id="application-details"
            name="details"
            rows={3}
            maxLength={2000}
          />
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button className={styles.primary} type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save details"}{" "}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </form>
      )}
    </section>
  );
}
