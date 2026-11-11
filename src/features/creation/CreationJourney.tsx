"use client";

import { useEffect, useState } from "react";
import { brandFont } from "@/shared/styles/fonts";
import { BuildingWorkspace } from "./BuildingWorkspace";
import { ApplicationDialog } from "./ApplicationDialog";
import styles from "./creation.module.css";

export function CreationJourney({
  prompt,
  mode = "chat",
}: {
  prompt: string;
  mode?: "classic" | "chat";
}) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPaused(true);
    }, 2200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`${brandFont.variable} ${styles.page}`}>
      <BuildingWorkspace prompt={prompt} mode={mode} paused={paused} />
      <ApplicationDialog
        entry={{ source: "prompt", prompt, mode }}
        open={paused}
      />
    </div>
  );
}
