"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { useFormBuilder } from "../hooks/useFormBuilder";
import { QuestionTypeMenu } from "./QuestionTypeMenu";
import { QuestionList } from "./QuestionList";
import {
  QuestionEditor,
  WelcomeScreenEditor,
  ThankYouScreenEditor,
} from "./QuestionEditor";
import { FormView } from "@/features/runtime";
import Link from "next/link";

const serif = { fontFamily: "var(--font-serif)" } as const;
const W = "#6B1A2A";
const I = "#F7F3EC";
const B = "#1C1410";
const M = "#7A6A60";
const WA = (a: number) => `rgba(107,26,42,${a})`;

const STORAGE_KEY = "byteform_guest_draft";

// ── Sign-up gate modal ─────────────────────────────────────────────────────
function SignUpModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(28,20,16,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "36px 36px 32px",
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 24px 64px rgba(28,20,16,0.18)",
          border: `0.5px solid ${WA(0.1)}`,
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 6,
            borderRadius: 6,
            color: M,
          }}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: WA(0.07),
            border: `0.5px solid ${WA(0.15)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="1" y="3" width="20" height="16" rx="3" stroke={W} strokeWidth="1.5" />
            <path d="M7 9h8M7 13h5" stroke={W} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h2 style={{ ...serif, fontSize: 22, fontWeight: 400, color: B, margin: "0 0 10px", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
          Save your form for free
        </h2>
        <p style={{ fontSize: 14, color: M, lineHeight: 1.7, margin: "0 0 28px" }}>
          Create a free account to save, publish, and share your form.
          Your work is preserved — no need to start over.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link
            href="/auth/login?mode=signup"
            style={{
              display: "block",
              textAlign: "center",
              padding: "11px 20px",
              borderRadius: 9,
              background: W,
              color: I,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Create free account
          </Link>
          <Link
            href="/auth/login"
            style={{
              display: "block",
              textAlign: "center",
              padding: "11px 20px",
              borderRadius: 9,
              background: "transparent",
              color: B,
              fontSize: 14,
              border: `0.5px solid ${WA(0.22)}`,
              textDecoration: "none",
            }}
          >
            Sign in to existing account
          </Link>
        </div>

        <p style={{ fontSize: 11, color: M, textAlign: "center", marginTop: 16 }}>
          No credit card required · Always free
        </p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
interface GuestBuilderShellProps {
  /**
   * When true, hides the shell's own header and mobile gate so the parent
   * page can provide its own nav. The outer div becomes h-full instead of
   * h-screen so it fills whatever container it lives in.
   */
  embedded?: boolean;
  initialDescription?: string;
  requestedMode?: "chat" | "classic";
}

export function GuestBuilderShell({
  embedded = false,
  initialDescription = "",
  requestedMode,
}: GuestBuilderShellProps) {
  const builder = useFormBuilder();
  const {
    form,
    selectedId,
    setSelectedId,
    selectedQuestion,
    editingScreen,
    setEditingScreen,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    reorderQuestions,
    updateWelcomeScreen,
    updateThankYouScreen,
    updateFormTitle,
  } = builder;

  const [rightTab, setRightTab] = useState<"editor" | "settings">(
    initialDescription ? "editor" : "settings",
  );
  const [showModal, setShowModal] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // ── Load from localStorage on first mount ──────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.title) builder.updateFormTitle(draft.title);
        if (draft.welcomeScreen) builder.updateWelcomeScreen(draft.welcomeScreen);
        if (draft.thankYouScreen) builder.updateThankYouScreen(draft.thankYouScreen);
      }
    } catch {
      // Corrupted storage — ignore
    }
    // Carry the landing brief into the existing builder without generating questions.
    if (initialDescription) {
      builder.updateWelcomeScreen({ description: initialDescription });
      builder.setEditingScreen("welcome");
    }
    setHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-save full form snapshot to localStorage ───────────────────────
  const formRef = useRef(form);
  useEffect(() => {
    formRef.current = form;
  });

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          requestedMode,
          title: form.title,
          questions: form.questions,
          welcomeScreen: form.welcomeScreen,
          thankYouScreen: form.thankYouScreen,
        }),
      );
    } catch {
      // Quota exceeded — ignore
    }
  }, [form.title, form.questions, form.welcomeScreen, form.thankYouScreen, hydrated, requestedMode]);

  // ── Panel selection helpers ────────────────────────────────────────────
  const selectQuestion = useCallback(
    (id: string) => {
      setSelectedId(id);
      setEditingScreen(null);
      setRightTab("editor");
    },
    [setSelectedId, setEditingScreen],
  );

  const selectScreen = useCallback(
    (screen: "welcome" | "thankyou") => {
      setEditingScreen(screen);
      setSelectedId(null);
      setRightTab("editor");
    },
    [setSelectedId, setEditingScreen],
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => updateFormTitle(e.target.value),
    [updateFormTitle],
  );

  const editorHasContent = selectedQuestion || editingScreen;

  return (
    <div
      className={`${embedded ? "h-full" : "h-screen"} flex flex-col overflow-hidden`}
      style={{ background: I, color: B }}
    >
      {/* Mobile gate — standalone mode only */}
      {!embedded && (
        <div className="md:hidden fixed inset-0 z-[999] bg-bg flex flex-col items-center justify-center text-center px-8">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: WA(0.06),
              border: `0.5px solid ${WA(0.15)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="14" rx="2" stroke={W} strokeWidth="1.5" />
              <path d="M8 22h8M12 18v4" stroke={W} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-fg font-normal mb-3">Open on a larger screen</h1>
          <p className="text-sm text-fg-muted leading-relaxed max-w-xs mb-8">
            The form builder works best on a desktop or laptop.
          </p>
          <Link href="/auth/login" className="text-sm text-[#F7F3EC] bg-accent px-6 py-2.5 rounded-lg no-underline">
            Sign in
          </Link>
        </div>
      )}

      {/* Sign-up modal */}
      {showModal && <SignUpModal onClose={() => setShowModal(false)} />}

      {/* Header — standalone mode only */}
      {!embedded && (
        <header
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            borderBottom: `0.5px solid ${WA(0.12)}`,
            background: "white",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <img src="/logo-icon.svg" alt="ByteForm" style={{ height: 26, width: 26 }} />
              <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <span style={{ ...serif, fontSize: 16, color: B, letterSpacing: "-0.3px" }}>Byte</span>
                <span style={{ ...serif, fontSize: 16, color: W, letterSpacing: "-0.3px" }}>Form</span>
              </div>
            </Link>
            <div style={{ width: 1, height: 16, background: WA(0.15) }} />
            <input
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              style={{ background: "transparent", fontSize: 13, fontWeight: 500, color: B, border: "none", outline: "none", width: 192 }}
              placeholder="Form title…"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: M }}>Draft · not saved</span>
            <Link
              href="/auth/login"
              style={{ fontSize: 12, color: B, textDecoration: "none", padding: "6px 14px", borderRadius: 7, border: `0.5px solid ${WA(0.22)}` }}
            >
              Sign in
            </Link>
            <button
              onClick={() => setShowModal(true)}
              style={{ fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer", background: W, color: I }}
            >
              Save to my account
            </button>
          </div>
        </header>
      )}

      {/* Three-panel layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left panel */}
        <div
          style={{
            width: 280,
            borderRight: `0.5px solid ${WA(0.12)}`,
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            background: "white",
          }}
        >
          <div style={{ padding: 12, borderBottom: `0.5px solid ${WA(0.1)}` }}>
            <QuestionTypeMenu onAdd={addQuestion} />
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
            {/* Welcome screen */}
            <button
              onClick={() => selectScreen("welcome")}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 8, textAlign: "left", marginBottom: 4,
                cursor: "pointer",
                background: editingScreen === "welcome" ? WA(0.07) : "transparent",
                border: `0.5px solid ${editingScreen === "welcome" ? WA(0.2) : "transparent"}`,
                color: B, fontSize: 13,
              }}
            >
              <span style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: WA(0.06), border: `0.5px solid ${WA(0.12)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 5.5C1 3.01 3.01 1 5.5 1S10 3.01 10 5.5 7.99 10 5.5 10" stroke={M} strokeWidth="1.1" strokeLinecap="round" />
                  <path d="M3.5 5.5L5 7L7.5 4" stroke={M} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Welcome Screen
            </button>

            <QuestionList
              questions={form.questions}
              selectedId={selectedId}
              onSelect={selectQuestion}
              onDelete={deleteQuestion}
              onDuplicate={duplicateQuestion}
              onReorder={reorderQuestions}
            />

            {/* Thank you screen */}
            <button
              onClick={() => selectScreen("thankyou")}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 8, textAlign: "left", marginTop: 4,
                cursor: "pointer",
                background: editingScreen === "thankyou" ? WA(0.07) : "transparent",
                border: `0.5px solid ${editingScreen === "thankyou" ? WA(0.2) : "transparent"}`,
                color: B, fontSize: 13,
              }}
            >
              <span style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: WA(0.06), border: `0.5px solid ${WA(0.12)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5L4.5 8L9 3" stroke={M} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Thank You Screen
            </button>
          </div>
        </div>

        {/* Center panel — live preview */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div
            style={{
              padding: "6px 16px",
              borderBottom: `0.5px solid ${WA(0.1)}`,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 500, color: M, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Preview
            </span>
            <button
              onClick={() => setShowModal(true)}
              style={{ fontSize: 11, color: W, background: "none", border: "none", cursor: "pointer" }}
            >
              Sign up to publish ↗
            </button>
          </div>
          <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "var(--color-bg)" }}>
            {form.questions.length === 0 ? (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 32 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 20, background: WA(0.05), border: `0.5px solid ${WA(0.15)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 3.5v11M3.5 9h11" stroke={W} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p style={{ fontSize: 14, fontWeight: 500, color: B, marginBottom: 6 }}>Add your first question</p>
                <p style={{ fontSize: 12, color: M, lineHeight: 1.6, maxWidth: 240 }}>
                  Use <strong>+ Add question</strong> in the left panel. Your preview will appear here.
                </p>
              </div>
            ) : (
              <div style={{ position: "absolute", inset: 0 }}>
                <FormView
                  form={form}
                  jumpTo={
                    editingScreen === "welcome"
                      ? "welcome"
                      : editingScreen === "thankyou"
                        ? "thankyou"
                        : (selectedId ?? undefined)
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div
          style={{
            width: 288,
            borderLeft: `0.5px solid ${WA(0.12)}`,
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            background: "white",
          }}
        >
          {/* Tab bar */}
          <div style={{ display: "flex", alignItems: "center", borderBottom: `0.5px solid ${WA(0.1)}`, padding: "0 4px" }}>
            <button
              onClick={() => setRightTab("editor")}
              style={{
                flex: 1, padding: "10px 8px", fontSize: 12, fontWeight: 500,
                background: "none", border: "none", cursor: "pointer",
                borderBottom: rightTab === "editor" ? `2px solid ${W}` : "2px solid transparent",
                color: rightTab === "editor" ? W : M, transition: "color 0.15s",
              }}
            >
              {editingScreen === "welcome" ? "Welcome" : editingScreen === "thankyou" ? "Thank You" : selectedQuestion ? "Edit Question" : "Editor"}
            </button>
            <button
              onClick={() => setRightTab("settings")}
              style={{
                flex: 1, padding: "10px 8px", fontSize: 12, fontWeight: 500,
                background: "none", border: "none", cursor: "pointer",
                borderBottom: rightTab === "settings" ? `2px solid ${W}` : "2px solid transparent",
                color: rightTab === "settings" ? W : M, transition: "color 0.15s",
              }}
            >
              Form Settings
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {requestedMode && (
              <p className="mb-4 text-xs text-[var(--color-fg-muted)]" role="status">
                Requested mode: {requestedMode === "chat" ? "Chat" : "Classic"}
              </p>
            )}
            {rightTab === "editor" && (
              <>
                {editingScreen === "welcome" && (
                  <WelcomeScreenEditor screen={form.welcomeScreen} onUpdate={updateWelcomeScreen} />
                )}
                {editingScreen === "thankyou" && (
                  <ThankYouScreenEditor screen={form.thankYouScreen} onUpdate={updateThankYouScreen} />
                )}
                {selectedQuestion && !editingScreen && (
                  <QuestionEditor question={selectedQuestion} allQuestions={form.questions} onUpdate={updateQuestion} />
                )}
                {!editorHasContent && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 48, textAlign: "center" }}>
                    <p style={{ fontSize: 13, color: M, lineHeight: 1.6 }}>
                      Select a question or screen in the left panel to edit it here.
                    </p>
                  </div>
                )}
              </>
            )}

            {rightTab === "settings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Save callout */}
                <div style={{ borderRadius: 10, padding: "14px 16px", background: WA(0.04), border: `0.5px solid ${WA(0.15)}` }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: B, margin: "0 0 6px" }}>
                    Your form isn&apos;t saved yet
                  </p>
                  <p style={{ fontSize: 12, color: M, margin: "0 0 14px", lineHeight: 1.55 }}>
                    Create a free account to save, publish, and share this form.
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    style={{ width: "100%", padding: "9px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none", background: W, color: I }}
                  >
                    Save to my account
                  </button>
                </div>

                {/* Questions summary */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: M, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Questions
                  </label>
                  <p style={{ fontSize: 13, color: B, margin: 0 }}>
                    {form.questions.length === 0
                      ? "No questions added yet."
                      : `${form.questions.length} question${form.questions.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
