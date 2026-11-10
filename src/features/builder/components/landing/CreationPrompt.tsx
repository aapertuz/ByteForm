"use client";

import Form from "next/form";
import { useState } from "react";
import { ArrowRight, AudioLines, Layers2, MessageCircle } from "lucide-react";
import styles from "./landing.module.css";

const creationModes = [
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "voice", label: "Voice", icon: AudioLines },
  { id: "classic", label: "Classic", icon: Layers2 },
] as const;

export function CreationPrompt() {
  const [mode, setMode] = useState("chat");
  return (
    <Form
      action="/new"
      className={styles.creationPrompt}
      onSubmit={(event) => {
        const input = event.currentTarget.elements.namedItem("prompt");
        if (input instanceof HTMLTextAreaElement && !input.value.trim()) {
          event.preventDefault();
          input.setCustomValidity("Describe the form you want to create.");
          input.reportValidity();
        }
      }}
    >
      <label className="sr-only" htmlFor="creation-prompt">
        Describe the form you want to create
      </label>
      <textarea
        id="creation-prompt"
        name="prompt"
        placeholder="Describe the form you want to create…"
        maxLength={1000}
        required
        rows={2}
        onChange={(event) => event.currentTarget.setCustomValidity("")}
      />
      <div className={styles.promptActions}>
        <fieldset className={styles.modeTabs} data-mode={mode}>
          <legend className="sr-only">Form mode to create</legend>
          {creationModes.map(({ id, label, icon: Icon }) => (
            <label key={id} className={styles.creationMode}>
              <input
                type="radio"
                name="mode"
                value={id}
                checked={mode === id}
                onChange={() => setMode(id)}
                className="sr-only"
              />
              <span>
                <Icon size={16} aria-hidden="true" />
                {label}
              </span>
            </label>
          ))}
        </fieldset>
        <button type="submit" className={styles.cta} disabled={mode === "voice"}>
          {mode === "voice" ? "Coming soon" : "Start now"}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </Form>
  );
}
