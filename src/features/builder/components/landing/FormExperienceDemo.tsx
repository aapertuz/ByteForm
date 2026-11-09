"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowRight,
  AudioLines,
  Check,
  Layers2,
  MessageCircle,
  Mic,
  RotateCcw,
  Send,
} from "lucide-react";
import Link from "next/link";
import styles from "./landing.module.css";

type Mode = "chat" | "voice" | "classic";
type Message = { role: "question" | "answer"; text: string };
const modes = [
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "voice", label: "Voice", icon: AudioLines },
  { id: "classic", label: "Classic", icon: Layers2 },
] as const;
const firstQuestion =
  "Hi there. Let’s make something people love. What’s your name?";

function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "question", text: firstQuestion },
  ]);
  const [answer, setAnswer] = useState("");
  const [step, setStep] = useState(0);
  const conversationRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLInputElement>(null);
  const completionRef = useRef<HTMLAnchorElement>(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (conversation) conversation.scrollTop = conversation.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!hasInteracted.current) return;
    if (step >= 3) completionRef.current?.focus();
    else answerRef.current?.focus();
  }, [step]);

  function reply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = answer.trim();
    if (!value || step >= 3) return;
    hasInteracted.current = true;
    const response =
      step === 0
        ? `Nice to meet you, ${value}. What would you like to learn from your customers?`
        : step === 1
          ? "That’s a good place to start. Would you rather ask in a chat, a voice conversation, or a classic form?"
          : "And that’s a wrap. A few questions, a little conversation. Ready to make your own?";
    setMessages((current) => [
      ...current,
      { role: "answer", text: value },
      { role: "question", text: response },
    ]);
    setAnswer("");
    setStep((current) => current + 1);
  }

  return (
    <div className={styles.chatDemo}>
      <div
        className={styles.conversation}
        ref={conversationRef}
        role="log"
        aria-label="Sample conversation"
        aria-live="polite"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "question"
                ? styles.questionRow
                : styles.answerRow
            }
          >
            {message.role === "question" && (
              <span className={styles.chatAvatar} aria-hidden="true">
                b.
              </span>
            )}
            <p
              className={
                message.role === "question" ? styles.question : styles.answer
              }
            >
              {message.text}
            </p>
          </div>
        ))}
      </div>
      {step < 3 ? (
        <form onSubmit={reply} className={styles.chatInput}>
          <label className="sr-only" htmlFor="demo-answer">
            Your answer
          </label>
          <input
            id="demo-answer"
            ref={answerRef}
            autoComplete="off"
            value={answer}
            maxLength={200}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder={step === 0 ? "Type your name…" : "Type your answer…"}
            required
          />
          <button
            type="submit"
            disabled={!answer.trim()}
            aria-label="Send answer"
          >
            <Send size={17} aria-hidden="true" />
          </button>
        </form>
      ) : (
        <div className={styles.demoComplete}>
          <Link href="/new" ref={completionRef}>
            Make your own <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <button
            onClick={() => {
              setMessages([{ role: "question", text: firstQuestion }]);
              setStep(0);
            }}
            aria-label="Restart chat demo"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      )}
      <p className={styles.demoPrivacy}>
        Just a demo. Your answers aren’t saved.
      </p>
    </div>
  );
}

function VoiceDemo() {
  const [preview, setPreview] = useState(false);
  return (
    <div className={styles.voiceDemo}>
      <span className={styles.voiceLabel}>Voice forms · Coming soon</span>
      <h3>
        A little less typing.
        <br />A little more you.
      </h3>
      <div
        className={`${styles.waveform} ${preview ? styles.waveformActive : ""}`}
        aria-hidden="true"
      >
        {Array.from({ length: 25 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <p>
        {preview
          ? "“What’s one thing we could do better?”"
          : "A conversation that leaves room for the whole story."}
      </p>
      <button
        className={styles.micButton}
        onClick={() => setPreview((current) => !current)}
        aria-pressed={preview}
        aria-label={preview ? "Reset voice preview" : "Preview voice form"}
      >
        <span key={String(preview)} className={styles.micIcon} aria-hidden="true">
          {preview ? <RotateCcw size={24} /> : <Mic size={24} />}
        </span>
      </button>
      <span className={styles.voiceDisclaimer} role="status">
        {preview
          ? "Preview only. Live voice isn’t available yet."
          : "Explore the preview. No microphone needed."}
      </span>
    </div>
  );
}

function ClassicDemo() {
  const [complete, setComplete] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (!hasSubmitted.current) return;
    if (complete) successRef.current?.focus();
    else nameRef.current?.focus();
  }, [complete]);

  if (complete)
    return (
      <div
        className={styles.classicSuccess}
        ref={successRef}
        role="status"
        tabIndex={-1}
      >
        <Check size={32} aria-hidden="true" />
        <h3>Good to know you.</h3>
        <p>
          That’s how simple a form can feel.
          <br />
          Your sample response wasn’t saved.
        </p>
        <button onClick={() => setComplete(false)}>
          Try again <RotateCcw size={15} aria-hidden="true" />
        </button>
      </div>
    );
  return (
    <form
      className={styles.classicForm}
      onSubmit={(event) => {
        event.preventDefault();
        hasSubmitted.current = true;
        setComplete(true);
      }}
    >
      <h3>Let’s get to know you.</h3>
      <p>A couple of questions. A good place to start.</p>
      <label htmlFor="classic-name">What’s your name?</label>
      <input
        id="classic-name"
        ref={nameRef}
        name="name"
        placeholder="Your name"
        required
        maxLength={100}
        autoComplete="off"
      />
      <label htmlFor="classic-purpose">What are you here to create?</label>
      <select id="classic-purpose" name="purpose" required defaultValue="">
        <option value="" disabled>
          Choose one…
        </option>
        <option>Customer feedback</option>
        <option>A registration form</option>
        <option>A research survey</option>
        <option>Something else</option>
      </select>
      <button type="submit">
        That’s me <ArrowRight size={16} aria-hidden="true" />
      </button>
      <small>Just a demo. Your answers aren’t saved.</small>
    </form>
  );
}

export function FormExperienceDemo() {
  const [mode, setMode] = useState<Mode>("chat");
  const [animateMode, setAnimateMode] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    function syncHash() {
      const selected = modes.find(
        (item) => `#demo-${item.id}` === window.location.hash,
      );
      if (selected) {
        setAnimateMode(false);
        setMode(selected.id);
      }
    }
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);
  function selectMode(selected: Mode, animate: boolean) {
    setAnimateMode(animate);
    setMode(selected);
    window.history.replaceState(window.history.state, "", `#demo-${selected}`);
  }

  function navigateTabs(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % modes.length;
    else if (event.key === "ArrowLeft")
      next = (index + modes.length - 1) % modes.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = modes.length - 1;
    else return;
    event.preventDefault();
    selectMode(modes[next].id, false);
    tabRefs.current[next]?.focus();
  }
  return (
    <div
      className={styles.demoWrapper}
      data-motion={animateMode ? "animate" : "instant"}
    >
      {modes.map(({ id }) => (
        <span
          key={id}
          id={`demo-${id}`}
          className={styles.demoAnchor}
          aria-hidden="true"
        />
      ))}
      <div className={styles.demoCard}>
        <header className={styles.demoHeader}>
          <span className={styles.demoStudio}>THE GOOD STUDIO</span>
          <span className={styles.demoSample}>A little introduction</span>
        </header>
        <div
          className={styles.demoPanel}
          id="form-demo-panel"
          role="tabpanel"
          aria-labelledby={`tab-${mode}`}
          tabIndex={0}
        >
          <div key={mode} className={styles.demoContent}>
            {mode === "chat" ? (
              <ChatDemo />
            ) : mode === "voice" ? (
              <VoiceDemo />
            ) : (
              <ClassicDemo />
            )}
          </div>
        </div>
        <div className={styles.demoBrand}>
          Made with <strong>byteform.</strong>
        </div>
      </div>
      <div className={styles.demoControls}>
        <div
          className={styles.modeTabs}
          data-mode={mode}
          role="tablist"
          aria-label="Try a form experience"
        >
          {modes.map(({ id, label, icon: Icon }, index) => (
            <button
              key={id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              role="tab"
              id={`tab-${id}`}
              aria-controls="form-demo-panel"
              aria-selected={mode === id}
              tabIndex={mode === id ? 0 : -1}
              onClick={(event) => selectMode(id, event.detail > 0)}
              onKeyDown={(event) => navigateTabs(event, index)}
              className={mode === id ? styles.activeTab : ""}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
