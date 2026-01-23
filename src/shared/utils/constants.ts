import { WizardStep } from "@/shared/components/wizard/ProgressWizard";

export const WIZARD_STEPS: WizardStep[] = [
  { id: 1, title: "Business Details", description: "Address & Contact" },
  { id: 2, title: "Bank Information", description: "Payment Details" },
  { id: 3, title: "Documents", description: "Verification Files" },
];

export const DEFAULT_COUNTRY = "India";
export const MAX_LOGO_SIZE_MB = 5;
export const MAX_DESCRIPTION_LENGTH = 2000;
