"use client";

import Image from "next/image";
import Link from "next/link";
import { Geist } from "next/font/google";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  type BillingInterval,
  type FormFormat,
  type PlanId,
  planIds,
  plans,
} from "./catalog";
import { JourneyBrief } from "./JourneyBrief";
import { JourneyPlan } from "./JourneyPlan";
import styles from "./journey.module.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-landing" });

type Draft = {
  plan: PlanId;
  billing: BillingInterval;
  format: FormFormat;
  prompt: string;
  complete: boolean;
};

type JourneyProps = {
  planParam?: string | string[];
  billingParam?: string | string[];
  success?: boolean;
};

const storageKey = "byteform-pricing-preview";
let memoryDraft: Draft | undefined;
let shouldFocusBrief = false;
const valid = (value: unknown, list: readonly string[]) =>
  typeof value === "string" && list.includes(value);

function restoreDraft(): Draft | undefined {
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        valid(parsed.plan, planIds) &&
        valid(parsed.billing, ["monthly", "annual"]) &&
        valid(parsed.format, ["classic", "chat", "voice"]) &&
        typeof parsed.prompt === "string"
      ) {
        return {
          ...parsed,
          prompt: parsed.prompt.slice(0, 1000),
          complete: parsed.complete === true,
        };
      }
    }
  } catch {
    // Keep the preview usable when browser storage is unavailable.
  }
  return memoryDraft;
}

function persistDraft(draft: Draft) {
  memoryDraft = draft;
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(draft));
  } catch {
    // The in-memory draft still survives navigation within the preview.
  }
}

export function Journey({
  planParam,
  billingParam,
  success = false,
}: JourneyProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>({
    plan: "classic",
    billing: "monthly",
    format: "classic",
    prompt: "",
    complete: false,
  });
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState(-1);
  const [error, setError] = useState("");
  const [changing, setChanging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const previewing = stage >= 0;

  useEffect(() => {
    const restored = restoreDraft();
    const plan =
      planParam === undefined
        ? (restored?.plan ?? "classic")
        : valid(planParam, planIds)
          ? (planParam as PlanId)
          : "classic";
    const billing =
      billingParam === undefined
        ? (restored?.billing ?? "monthly")
        : valid(billingParam, ["monthly", "annual"])
          ? (billingParam as BillingInterval)
          : "monthly";
    const format =
      restored && plans[plan].formats.includes(restored.format)
        ? restored.format
        : plan === "classic"
          ? "classic"
          : "chat";
    const next = {
      plan,
      billing,
      format,
      prompt: restored?.prompt ?? "",
      complete: restored?.complete ?? false,
    };
    queueMicrotask(() => {
      setDraft(next);
      setReady(true);
    });
    if (success && !next.complete)
      router.replace(`/start?plan=${plan}&billing=${billing}`);
  }, [planParam, billingParam, success, router]);

  useEffect(() => {
    if (ready) persistDraft(draft);
  }, [ready, draft]);

  useEffect(() => {
    if (!ready) return;
    if (previewing || success) resultHeadingRef.current?.focus();
    else if (shouldFocusBrief) {
      textareaRef.current?.focus();
      shouldFocusBrief = false;
    }
  }, [ready, previewing, success]);

  const finishPreview = useCallback(() => {
    const next = { ...draft, complete: true };
    persistDraft(next);
    setDraft(next);
    setStage(-1);
    router.push("/start/success");
  }, [draft, router]);

  useEffect(() => {
    if (stage < 0) return;
    const timer = window.setTimeout(() => {
      if (stage < 2) setStage((value) => value + 1);
      else finishPreview();
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [stage, finishPreview]);

  function selectPlan(plan: PlanId) {
    setDraft((previous) => ({
      ...previous,
      plan,
      format: plans[plan].formats.includes(previous.format)
        ? previous.format
        : "classic",
      complete: false,
    }));
    setChanging(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.prompt.trim()) {
      setError("Enter a short description to continue.");
      textareaRef.current?.focus();
      return;
    }
    setError("");
    setChanging(false);
    setStage(0);
  }

  function backToEdit() {
    shouldFocusBrief = true;
    setStage(-1);
    setDraft((previous) => ({ ...previous, complete: false }));
    router.replace(`/start?plan=${draft.plan}&billing=${draft.billing}`);
  }

  const currentStep = success ? 2 : previewing ? 1 : 0;

  return (
    <div className={`${geist.variable} ${styles.journey}`}>
      <a className={styles.skipLink} href="#journey-content">
        Skip to content
      </a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="ByteForm home">
          <Image src="/logo-icon.svg" width={28} height={28} alt="" />
          <span>
            byteform<span className={styles.brandPeriod}>.</span>
          </span>
        </Link>
        <Link className={styles.backLink} href="/#pricing">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to pricing
        </Link>
      </header>
      <main id="journey-content" className={styles.content}>
        <ol className={styles.steps} aria-label="Creation preview progress">
          {["Describe", "Preview", "Done"].map((label, index) => (
            <li
              key={label}
              aria-current={currentStep === index ? "step" : undefined}
              data-complete={currentStep > index}
            >
              <span className={styles.stepNumber} aria-hidden="true">
                {currentStep > index ? <Check size={13} /> : index + 1}
              </span>
              {label}
            </li>
          ))}
        </ol>
        {!ready ? (
          <p className={styles.loading} role="status">
            Loading preview…
          </p>
        ) : (
          <div className={styles.workspace}>
            {success ? (
              <section className={styles.result}>
                <div className={styles.resultIcon}>
                  <Check size={25} aria-hidden="true" />
                </div>
                <h1 ref={resultHeadingRef} tabIndex={-1}>
                  Preview complete.
                </h1>
                <p>You’ve reached the end of the creation preview.</p>
                <p>No form has been generated or saved.</p>
                <p className={styles.resultSummary}>
                  {plans[draft.plan].name} plan <span>·</span>{" "}
                  {draft.format[0].toUpperCase() + draft.format.slice(1)} format
                </p>
                <div className={styles.resultActions}>
                  <button className={styles.primary} onClick={backToEdit}>
                    Edit brief <ArrowRight size={17} aria-hidden="true" />
                  </button>
                  <Link className={styles.textButton} href="/#pricing">
                    Back to pricing
                  </Link>
                </div>
              </section>
            ) : previewing ? (
              <section className={styles.result}>
                <h1 ref={resultHeadingRef} tabIndex={-1}>
                  Preparing your preview
                </h1>
                <p className={styles.previewNotice}>
                  <Info size={16} aria-hidden="true" />
                  Simulated preview. No form is generated or saved.
                </p>
                <ol className={styles.progress} aria-live="polite">
                  {[
                    "Understanding your brief",
                    "Creating your questions",
                    `Tailoring your ${draft.format} form`,
                  ].map((label, index) => (
                    <li
                      key={label}
                      data-active={stage === index}
                      data-done={stage > index}
                    >
                      <span
                        className={styles.progressMarker}
                        aria-hidden="true"
                      >
                        {stage > index ? <Check size={14} /> : index + 1}
                      </span>
                      {label}
                      {stage > index && (
                        <span className="sr-only">Complete</span>
                      )}
                      {stage === index && (
                        <span className="sr-only">In progress</span>
                      )}
                    </li>
                  ))}
                </ol>
                <div className={styles.resultActions}>
                  <button className={styles.primary} onClick={finishPreview}>
                    Skip preview <ArrowRight size={17} aria-hidden="true" />
                  </button>
                  <button className={styles.textButton} onClick={backToEdit}>
                    Edit brief
                  </button>
                </div>
              </section>
            ) : (
              <JourneyBrief
                prompt={draft.prompt}
                format={draft.format}
                allowedFormats={plans[draft.plan].formats}
                error={error}
                textareaRef={textareaRef}
                onPromptChange={(prompt) => {
                  setDraft((previous) => ({
                    ...previous,
                    prompt,
                    complete: false,
                  }));
                  if (error) setError("");
                }}
                onFormatChange={(format) =>
                  setDraft((previous) => ({
                    ...previous,
                    format,
                    complete: false,
                  }))
                }
                onChangePlan={() => setChanging(true)}
                onSubmit={submit}
              />
            )}
            <JourneyPlan
              plan={draft.plan}
              billing={draft.billing}
              changing={changing}
              onToggle={() => setChanging((value) => !value)}
              onSelect={selectPlan}
            />
          </div>
        )}
      </main>
    </div>
  );
}
