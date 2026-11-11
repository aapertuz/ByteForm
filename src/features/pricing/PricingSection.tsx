"use client";
import { useId, useState, type MouseEvent } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { scrollToElement } from "@/shared/lib/scroll-to-element";
import { ApplicationDialog } from "@/features/creation/ApplicationDialog";
import { BillingInterval, PlanId, planIds, plans, price } from "./catalog";
import styles from "./pricing.module.css";

export function PricingSection() {
  const [selection, setSelection] = useState<{
    plan: PlanId;
    billing: BillingInterval;
    animate: boolean;
  }>();
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [billing, setBilling] = useState<BillingInterval>("annual");
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const comparisonId = useId();

  function toggleComparison(event: MouseEvent<HTMLButtonElement>) {
    setComparisonOpen(!comparisonOpen);
    if (!comparisonOpen) scrollToElement(event.currentTarget);
  }
  return (
    <div className={styles.pricingInner}>
      <h2 id="pricing-title">Choose your plan.</h2>
      <fieldset className={styles.billing}>
        <legend className="sr-only">Billing interval</legend>
        {(["monthly", "annual"] as const).map((interval) => (
          <label
            key={interval}
            className={billing === interval ? styles.billingActive : ""}
          >
            <input
              type="radio"
              name="billing"
              value={interval}
              checked={billing === interval}
              onChange={() => setBilling(interval)}
            />
            {interval === "monthly" ? (
              "Monthly"
            ) : (
              <>
                Annually <span>Save up to 21%</span>
              </>
            )}
          </label>
        ))}
      </fieldset>
      <div className={styles.cards}>
        {planIds.map((id) => {
          const plan = plans[id];
          const amount = billing === "monthly" ? plan.monthly : plan.annual;
          return (
            <article
              key={id}
              className={`${styles.card} ${id === "pro" ? styles.recommended : ""}`}
            >
              <div className={styles.cardTitle}>
                <h3>{plan.name}</h3>
                {id === "pro" && <span>Recommended</span>}
              </div>
              <p className={styles.description}>{plan.description}</p>
              <p className={styles.price}>
                {price(amount)}
                <span>/ month</span>
              </p>
              <p className={styles.billingDetail}>
                {billing === "annual"
                  ? `${price(plan.annualTotal)} billed annually`
                  : "Billed monthly"}
              </p>
              <ul>
                {[
                  `${plan.responses} standard responses / month`,
                  `${plan.members} members`,
                  `${plan.workspaces} ${plan.workspaces === "1" ? "workspace" : "workspaces"}`,
                  "Custom branding",
                  "Unlimited forms and questions",
                  "Analytics and exports",
                ].map((item) => (
                  <li key={item}>
                    <Check size={16} />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={styles.planCta}
                onClick={(event) => {
                  setSelection({
                    plan: id,
                    billing,
                    animate: event.detail !== 0,
                  });
                  setApplicationOpen(true);
                }}
                aria-label={`Start now with ${plan.name}`}
                aria-haspopup="dialog"
              >
                Start now <ArrowRight size={17} aria-hidden="true" />
              </button>
            </article>
          );
        })}
      </div>
      <div className={styles.compare}>
        <button
          type="button"
          className={styles.compareToggle}
          aria-expanded={comparisonOpen}
          aria-controls={comparisonId}
          onClick={toggleComparison}
        >
          Compare all features <ChevronDown size={17} aria-hidden="true" />
        </button>
        <div
          id={comparisonId}
          className={styles.compareContent}
          data-open={comparisonOpen}
          inert={!comparisonOpen}
        >
          <div className={styles.compareBody}>
            <p>
              A workspace is a separate area for forms, responses, and
              collaborators. Seats count people.
            </p>
            <div
              className={styles.tableScroll}
              role="region"
              aria-label="Plan feature comparison"
              tabIndex={0}
            >
              <table>
                <thead>
                  <tr>
                    <th>Capability</th>
                    {planIds.map((id) => (
                      <th key={id}>{plans[id].name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Formats</th>
                    <td>Classic</td>
                    <td>Classic, chat, voice</td>
                    <td>Classic, chat, voice</td>
                  </tr>
                  <tr>
                    <th>Standard responses / month</th>
                    {planIds.map((id) => (
                      <td key={id}>{plans[id].responses}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>Members, including owner</th>
                    {planIds.map((id) => (
                      <td key={id}>{plans[id].members}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>Workspaces</th>
                    {planIds.map((id) => (
                      <td key={id}>{plans[id].workspaces}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>Custom domains</th>
                    {planIds.map((id) => (
                      <td key={id}>{plans[id].domains}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>Team access</th>
                    {planIds.map((id) => (
                      <td key={id}>{plans[id].team}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>
                      Custom branding, analytics, drop-off reporting, CSV/XLSX
                      exports
                    </th>
                    {planIds.map((id) => (
                      <td key={id}>Included</td>
                    ))}
                  </tr>
                  <tr>
                    <th>Support</th>
                    {planIds.map((id) => (
                      <td key={id}>{plans[id].support}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {selection && (
        <ApplicationDialog
          key={`${selection.plan}-${selection.billing}`}
          entry={{
            source: "pricing",
            plan: selection.plan,
            billing: selection.billing,
          }}
          animate={selection.animate}
          open={applicationOpen}
          onRequestClose={() => setApplicationOpen(false)}
        />
      )}
    </div>
  );
}
