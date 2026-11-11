import { ArrowRight, Info, ListChecks, MessageCircle, Mic } from "lucide-react";
import type { FormEvent, RefObject } from "react";
import type { FormFormat } from "./catalog";
import styles from "./journey.module.css";

const formats = [
  {
    id: "classic",
    name: "Classic",
    description: "A familiar form, filled in at their own pace.",
    Icon: ListChecks,
  },
  {
    id: "chat",
    name: "Chat",
    description: "One question at a time, in a conversation.",
    Icon: MessageCircle,
  },
  {
    id: "voice",
    name: "Voice",
    description: "A conversation they can talk through.",
    Icon: Mic,
  },
] as const;

type JourneyBriefProps = {
  prompt: string;
  format: FormFormat;
  allowedFormats: readonly FormFormat[];
  error: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onPromptChange: (prompt: string) => void;
  onFormatChange: (format: FormFormat) => void;
  onChangePlan: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function JourneyBrief({
  prompt,
  format,
  allowedFormats,
  error,
  textareaRef,
  onPromptChange,
  onFormatChange,
  onChangePlan,
  onSubmit,
}: JourneyBriefProps) {
  const hasRestrictedFormats = formats.some(
    ({ id }) => !allowedFormats.includes(id),
  );

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.intro}>
        <h1>What is your form about?</h1>
        <p>Tell us who it’s for and what you want to learn.</p>
      </div>

      <div className={styles.briefField}>
        <label htmlFor="prompt">Your form brief</label>
        <div className={styles.promptSurface} data-invalid={Boolean(error)}>
          <textarea
            ref={textareaRef}
            id="prompt"
            maxLength={1000}
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Collect feedback from customers after their first purchase. Find out what went well and what we could do better."
            aria-invalid={Boolean(error)}
            aria-required="true"
            aria-describedby={`prompt-hint prompt-count${error ? " prompt-error" : ""}`}
          />
          <div className={styles.promptMeta}>
            <span id="prompt-hint">A few sentences are all you need.</span>
            <span id="prompt-count">
              {prompt.length.toLocaleString("en-US")} / 1,000
            </span>
          </div>
        </div>
        {error && (
          <p className={styles.error} id="prompt-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <fieldset className={styles.formats}>
        <legend>How should respondents answer?</legend>
        <p className={styles.fieldHint}>
          Choose the experience people will see.
        </p>
        <div className={styles.formatOptions}>
          {formats.map(({ id, name, description, Icon }) => {
            const allowed = allowedFormats.includes(id);
            return (
              <label
                className={styles.formatOption}
                key={id}
                data-disabled={!allowed}
              >
                <span className={styles.formatTop}>
                  <Icon size={21} strokeWidth={1.6} aria-hidden="true" />
                  <input
                    type="radio"
                    name="format"
                    value={id}
                    checked={format === id}
                    disabled={!allowed}
                    onChange={() => onFormatChange(id)}
                    aria-labelledby={`format-${id}-name`}
                    aria-describedby={`format-${id}-description format-${id}-status`}
                  />
                </span>
                <span id={`format-${id}-name`} className={styles.formatName}>
                  {name}
                </span>
                <span
                  id={`format-${id}-description`}
                  className={styles.formatDescription}
                >
                  {description}
                </span>
                <span
                  id={`format-${id}-status`}
                  className={styles.formatStatus}
                >
                  {id === "voice"
                    ? "Coming soon · preview only"
                    : allowed
                      ? "Included in your plan"
                      : "Available with Pro & Team"}
                </span>
              </label>
            );
          })}
        </div>
        {hasRestrictedFormats && (
          <p className={styles.upgradeHint}>
            Chat and Voice are included in Pro and Team.{" "}
            <button
              type="button"
              className={styles.textButton}
              onClick={onChangePlan}
            >
              Change plan <ArrowRight size={13} aria-hidden="true" />
            </button>
          </p>
        )}
      </fieldset>

      <div className={styles.formFooter}>
        <p className={styles.notice}>
          <Info size={16} aria-hidden="true" />
          <span>
            This is a preview. No form will be
            <br className={styles.desktopBreak} /> generated or saved.
          </span>
        </p>
        <button className={styles.primary} type="submit">
          Preview creation <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
