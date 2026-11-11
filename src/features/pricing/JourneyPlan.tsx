import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  planIds,
  plans,
  price,
  type BillingInterval,
  type PlanId,
} from "./catalog";
import styles from "./journey.module.css";

type JourneyPlanProps = {
  plan: PlanId;
  billing: BillingInterval;
  changing: boolean;
  onToggle: () => void;
  onSelect: (plan: PlanId) => void;
};

export function JourneyPlan({
  plan,
  billing,
  changing,
  onToggle,
  onSelect,
}: JourneyPlanProps) {
  const current = plans[plan];
  const amount = billing === "annual" ? current.annual : current.monthly;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (changing) pickerRef.current?.querySelector("button")?.focus();
  }, [changing]);

  function selectPlan(id: PlanId) {
    onSelect(id);
    toggleRef.current?.focus();
  }

  return (
    <aside className={styles.planSummary} aria-labelledby="plan-title">
      <div className={styles.planHeading}>
        <h2 id="plan-title">{current.name} plan</h2>
        <span>{billing === "annual" ? "Annual" : "Monthly"}</span>
      </div>
      <p className={styles.planPrice}>
        {price(amount)}
        <span>/ month</span>
      </p>
      <p className={styles.billingDetail}>
        {billing === "annual"
          ? `${price(current.annualTotal)} billed annually`
          : "Billed monthly"}
      </p>
      <ul className={styles.planFeatures}>
        {[
          `${current.responses} responses / month`,
          `${current.members} members`,
          "Custom branding",
        ].map((feature) => (
          <li key={feature}>
            <Check size={15} aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        ref={toggleRef}
        className={styles.planToggle}
        type="button"
        onClick={onToggle}
        aria-expanded={changing}
        aria-controls="plan-picker"
      >
        Change plan <ChevronDown size={15} aria-hidden="true" />
      </button>
      {changing && (
        <div
          ref={pickerRef}
          id="plan-picker"
          className={styles.planPicker}
          role="group"
          aria-label="Choose a preview plan"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              onToggle();
              toggleRef.current?.focus();
            }
          }}
        >
          {planIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => selectPlan(id)}
              aria-pressed={plan === id}
            >
              <span>{plans[id].name}</span>
              <span>
                {price(
                  billing === "annual" ? plans[id].annual : plans[id].monthly,
                )}{" "}
                / mo
              </span>
              {plan === id ? (
                <Check size={14} aria-hidden="true" />
              ) : (
                <ArrowRight size={14} aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
      <p className={styles.planDisclosure}>
        Plan details are for this preview.
        <br />
        No payment or subscription is started.
      </p>
    </aside>
  );
}
