import { Layers2, LockKeyhole, MessageSquare, Sparkles } from "lucide-react";
import { BrandLink } from "@/shared/components/site/BrandLink";
import styles from "./creation.module.css";

type BuildingWorkspaceProps = {
  prompt: string;
  mode: "classic" | "chat";
  paused: boolean;
};

export function BuildingWorkspace({
  prompt,
  mode,
  paused,
}: BuildingWorkspaceProps) {
  return (
    <main className={styles.workspace}>
      <aside className={styles.chat} aria-label="Form creation chat">
        <header className={styles.chatHeader}>
          <BrandLink />
        </header>
        <div className={styles.chatContent}>
          <p className={styles.chatTitle}>
            <MessageSquare size={16} aria-hidden="true" /> Your new form
          </p>
          <p className={styles.prompt}>{prompt}</p>
          <div className={styles.assistant} role="status">
            <span className={styles.assistantIcon}>
              <Sparkles size={17} aria-hidden="true" />
            </span>
            <div>
              <strong>
                {paused ? "Awaiting signup…" : "Starting your form…"}
              </strong>
              <p>
                {paused
                  ? "Your idea is here. Take the next step to continue."
                  : "Preparing a space for your questions."}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.chatFooter}>
          <LockKeyhole size={15} aria-hidden="true" />{" "}
          {paused ? "Sign up to continue" : "Preparing your preview"}
        </div>
      </aside>
      <section
        className={styles.preview}
        aria-labelledby="preview-title"
        data-paused={paused}
      >
        <header className={styles.previewHeader}>
          <span>
            <Layers2 size={18} aria-hidden="true" />
            <h1 id="preview-title">Form preview</h1>
          </span>
          <span className={styles.format}>
            {mode === "chat" ? "Chat" : "Classic"}
          </span>
        </header>
        <div className={styles.previewBody}>
          <div className={styles.buildStatus}>
            <span className={styles.statusDot} />
            {paused ? "Building paused" : "Setting things in motion"}
          </div>
          <div className={styles.formSkeleton} aria-hidden="true">
            <div className={styles.skeletonBrand} />
            <div className={styles.skeletonHeading} />
            <div className={styles.skeletonDescription} />
            {[1, 2, 3].map((question) => (
              <div className={styles.skeletonQuestion} key={question}>
                <span>{String(question).padStart(2, "0")}</span>
                <div>
                  <div className={styles.skeletonLabel} />
                  <div className={styles.skeletonInput} />
                </div>
              </div>
            ))}
            <div className={styles.skeletonButton} />
          </div>
          <p className={styles.previewNote}>
            A preview of what’s next. Your form hasn’t been generated yet.
          </p>
        </div>
      </section>
    </main>
  );
}
