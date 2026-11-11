import { Check } from "lucide-react";
import {
  planIds,
  plans,
  price,
  type BillingInterval,
  type PlanId,
} from "@/features/pricing/catalog";
import styles from "./creation.module.css";

type PlanPickerProps = {
  selected?: PlanId;
  disabled?: boolean;
  billing: BillingInterval;
  onSelect: (plan: PlanId) => void;
  onBillingChange: (billing: BillingInterval) => void;
};

export function PlanPicker({
  selected,
  disabled = false,
  billing,
  onSelect,
  onBillingChange,
}: PlanPickerProps) {
  return (
    <>
      <fieldset className={styles.billing} disabled={disabled}>
        <legend className="sr-only">Billing interval</legend>
        {(["monthly", "annual"] as const).map((interval) => (
          <label key={interval} data-selected={billing === interval}>
            <input
              type="radio"
              name="application-billing"
              value={interval}
              checked={billing === interval}
              onChange={() => onBillingChange(interval)}
            />
            {interval === "monthly" ? "Monthly" : "Annually"}
          </label>
        ))}
      </fieldset>
      <fieldset className={styles.plans} disabled={disabled}>
        <legend className="sr-only">Choose your pricing tier</legend>
        {planIds.map((id) => {
          const plan = plans[id];
          return (
            <label
              key={id}
              className={styles.plan}
              data-selected={selected === id}
            >
              <div className={styles.planTop}>
                <span className={styles.planName}>{plan.name}</span>
                <input
                  type="radio"
                  aria-label={`${plan.name} plan`}
                  name="application-plan"
                  value={id}
                  checked={selected === id}
                  onChange={() => onSelect(id)}
                  required
                />
              </div>
              <p className={styles.planDescription}>{plan.description}</p>
              <p className={styles.price}>
                {price(billing === "annual" ? plan.annual : plan.monthly)}
                <span>/ month</span>
              </p>
              <p className={styles.billingNote}>
                {billing === "annual"
                  ? `${price(plan.annualTotal)} billed annually`
                  : "Billed monthly"}
              </p>
              <ul>
                {[
                  `${plan.responses} responses / month`,
                  `${plan.members} members`,
                  "Custom branding",
                ].map((feature) => (
                  <li key={feature}>
                    <Check size={14} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              {id !== "classic" && (
                <p className={styles.voiceNote}>Voice coming soon</p>
              )}
            </label>
          );
        })}
      </fieldset>
    </>
  );
}
