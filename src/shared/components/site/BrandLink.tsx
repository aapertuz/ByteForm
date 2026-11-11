import Image from "next/image";
import Link from "next/link";
import styles from "./site.module.css";

export function BrandLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`${styles.brand} ${className}`}
      aria-label="ByteForm home"
    >
      <Image src="/logo-icon.svg" width={30} height={30} alt="" />
      <span>
        byteform<span className={styles.period}>.</span>
      </span>
    </Link>
  );
}
