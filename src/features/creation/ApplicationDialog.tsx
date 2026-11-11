"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  LoaderCircle,
  Mail,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { brandFont } from "@/shared/styles/fonts";
import {
  plans,
  price,
  type BillingInterval,
  type PlanId,
} from "@/features/pricing/catalog";
import { PlanPicker } from "./PlanPicker";
import { ApplicationResult } from "./ApplicationResult";
import { submitApplication } from "./submit-application";
import styles from "./creation.module.css";

type Step = "email" | "plan" | "complete";
export type ApplicationEntry =
  | { source: "prompt"; prompt: string; mode: "classic" | "chat" }
  | { source: "pricing"; plan: PlanId; billing: BillingInterval };

export function ApplicationDialog({
  entry,
  open,
  animate = true,
  onRequestClose,
}: {
  entry: ApplicationEntry;
  open: boolean;
  animate?: boolean;
  onRequestClose?: () => void;
}) {
  const dismissible = entry.source === "pricing";
  const [step, setStep] = useState<Step>("email");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<PlanId | undefined>(
    entry.source === "pricing" ? entry.plan : undefined,
  );
  const [billing, setBilling] = useState<BillingInterval>(
    entry.source === "pricing" ? entry.billing : "monthly",
  );
  const emailRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      emailRef.current?.focus();
    } else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add(styles.modalOpen);
    return () => document.body.classList.remove(styles.modalOpen);
  }, [open]);

  useEffect(() => {
    if (step !== "email") titleRef.current?.focus();
    else if (dialogRef.current?.open) emailRef.current?.focus();
  }, [step]);

  async function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setError("");
    if (step === "email" && entry.source === "prompt") {
      setEmail(email.trim());
      setStep("plan");
    } else if (plan) {
      setSaving(true);
      try {
        await submitApplication(
          "POST",
          entry.source === "pricing"
            ? { source: "pricing", email: email.trim(), plan, billing }
            : {
                email: email.trim(),
                plan,
                billing,
                prompt: entry.prompt,
                mode: entry.mode,
              },
        );
        setStep("complete");
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "We couldn’t save your application. Please try again.",
        );
      } finally {
        setSaving(false);
      }
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={`${brandFont.variable} ${styles.dialog}`}
      data-step={step}
      data-motion={animate ? "full" : "instant"}
      onKeyDown={(event) => {
        event.currentTarget.dataset.motion = "instant";
      }}
      onPointerDown={(event) => {
        event.currentTarget.dataset.motion = "full";
      }}
      aria-labelledby="application-title"
      aria-describedby="application-disclosure"
      onCancel={(event) => {
        event.preventDefault();
        if (dismissible && !saving) onRequestClose?.();
      }}
      onClose={(event) => {
        if (!dismissible && open) {
          event.currentTarget.showModal();
          return;
        }
        onRequestClose?.();
      }}
    >
      {dismissible && (
        <button
          type="button"
          disabled={saving}
          className={styles.close}
          aria-label="Close signup"
          onClick={onRequestClose}
        >
          <X size={19} aria-hidden="true" />
        </button>
      )}
      {step === "complete" ? (
        <div key="complete" className={styles.stepEntrance}>
          <ApplicationResult headingRef={titleRef} />
        </div>
      ) : (
        <form
          key={step}
          onSubmit={next}
          className={`${styles.applicationForm} ${styles.stepEntrance}`}
          aria-busy={saving}
        >
          {step === "plan" && (
            <button
              className={styles.back}
              type="button"
              disabled={saving}
              onClick={() => {
                setError("");
                setStep("email");
              }}
            >
              <ArrowLeft size={15} aria-hidden="true" /> Back
            </button>
          )}
          <h1 id="application-title" ref={titleRef} tabIndex={-1}>
            {step === "email"
              ? entry.source === "pricing"
                ? "You’re one step away."
                : "Sign up to continue creating"
              : "Choose your plan."}
          </h1>
          <p className={styles.intro}>
            {step === "email"
              ? "Your next great conversation starts here."
              : "Pick the tier that fits what you have in mind."}
          </p>
          {step === "email" && entry.source === "pricing" && (
            <p className={styles.selectedPlan}>
              <Check size={15} aria-hidden="true" />
              {plans[entry.plan].name} ·{" "}
              {price(
                entry.billing === "annual"
                  ? plans[entry.plan].annual
                  : plans[entry.plan].monthly,
              )}{" "}
              / month
              <span>
                {entry.billing === "annual"
                  ? "Billed annually"
                  : "Billed monthly"}
              </span>
            </p>
          )}
          {step === "email" ? (
            <div className={styles.emailField}>
              <label htmlFor="application-email">Email</label>
              <div className={styles.emailInput}>
                <Mail size={18} aria-hidden="true" />
                <input
                  id="application-email"
                  ref={emailRef}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  disabled={saving}
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>
          ) : (
            <PlanPicker
              selected={plan}
              disabled={saving}
              billing={billing}
              onSelect={setPlan}
              onBillingChange={setBilling}
            />
          )}
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button
            className={styles.primary}
            type="submit"
            disabled={saving || (step === "plan" && !plan)}
          >
            {saving ? "Sending…" : "Next"}{" "}
            {saving ? (
              <LoaderCircle
                className={styles.spinner}
                size={17}
                aria-hidden="true"
              />
            ) : (
              <ArrowRight size={17} aria-hidden="true" />
            )}
          </button>
          {step === "plan" && (
            <p className={styles.noCharge}>
              No payment now. This records your preferred tier.
            </p>
          )}
        </form>
      )}
      <p className={styles.disclosure} id="application-disclosure">
        We’ll use your email to follow up on your application. No account or
        subscription is created.
      </p>
    </dialog>
  );
}
