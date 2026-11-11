export type PlanId = "classic" | "pro" | "team";
export type BillingInterval = "monthly" | "annual";
export type FormFormat = "classic" | "chat" | "voice";
export type PreviewStage = 0 | 1 | 2;

export const plans = {
  classic: { name: "Classic", monthly: 12, annual: 9, annualTotal: 108, description: "Classic forms with custom branding.", formats: ["classic"] as FormFormat[], responses: "5,000", members: "3", workspaces: "1", domains: "Not included", team: "Shared editing and results", support: "Standard email" },
  pro: { name: "Pro", monthly: 24, annual: 19, annualTotal: 228, description: "More ways to ask, with chat and voice.", formats: ["classic", "chat", "voice"] as FormFormat[], responses: "25,000", members: "Unlimited", workspaces: "1", domains: "1", team: "Shared editing and results", support: "Standard email" },
  team: { name: "Team", monthly: 59, annual: 49, annualTotal: 588, description: "Separate workspaces and more control for your team.", formats: ["classic", "chat", "voice"] as FormFormat[], responses: "100,000", members: "Unlimited", workspaces: "5", domains: "5", team: "Workspace/form permissions; admin/editor/viewer roles; activity history", support: "Priority email" },
} satisfies Record<PlanId, {name:string; monthly:number; annual:number; annualTotal:number; description:string; formats:FormFormat[]; responses:string; members:string; workspaces:string; domains:string; team:string; support:string}>;

export const planIds = Object.keys(plans) as PlanId[];
export const price = (amount: number) => `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
