import Image from "next/image";
import { brandFont } from "@/shared/styles/fonts";
import site from "@/shared/components/site/site.module.css";
import styles from "@/shared/components/site/state.module.css";

export default function Loading() {
  return (
    <main
      className={`${brandFont.variable} ${site.surface} ${styles.loading}`}
      aria-busy="true"
    >
      <Image src="/logo-icon.svg" width={36} height={36} alt="ByteForm" />
      <div className={styles.loadingLine} aria-hidden="true" />
      <p role="status">Getting things ready…</p>
    </main>
  );
}
