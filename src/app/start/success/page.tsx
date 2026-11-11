import type { Metadata } from "next";
import { Journey } from "@/features/pricing/Journey";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function Success(){ return <Journey success/>; }
