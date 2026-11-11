import type { Metadata } from "next";
import { Journey } from "@/features/pricing/Journey";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function Start({searchParams}:{searchParams:Promise<{plan?:string|string[];billing?:string|string[]}>}) { const params=await searchParams; return <Journey planParam={params.plan} billingParam={params.billing}/>; }
