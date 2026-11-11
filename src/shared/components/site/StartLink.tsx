import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./site.module.css";

export function StartLink({
  light = false,
  className = "",
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/new"
      className={className || `${styles.cta} ${light ? styles.light : ""}`}
    >
      Start now <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}
