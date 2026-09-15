/** One place that answers "what does this locale say". Everything downstream
 *  takes a bundle rather than importing a language directly, so adding a third
 *  language never touches a component. */

import { OPEN_EN, PRODUCTION_EN, type Case } from "./cases";
import { JOBS, PLATFORM, RESEARCH, STACK, SYSTEM } from "./content";
import type { Jobs, PlatformPart, ResearchNode, SystemStage, Tier } from "./content";
import { JOBS_TR, OPEN_TR, PLATFORM_TR, PRODUCTION_TR, RESEARCH_TR, STACK_TR, SYSTEM_TR } from "./tr";
import { UI, type Locale } from "./copy";

export type Bundle = {
  ui: (typeof UI)[Locale];
  production: Case[];
  open: Case[];
  platform: PlatformPart[];
  system: SystemStage[];
  research: ResearchNode[];
  jobs: Jobs;
  stack: Tier[];
};

export function bundle(locale: Locale): Bundle {
  return locale === "tr"
    ? { ui: UI.tr, production: PRODUCTION_TR, open: OPEN_TR, platform: PLATFORM_TR, system: SYSTEM_TR, research: RESEARCH_TR, jobs: JOBS_TR, stack: STACK_TR }
    : { ui: UI.en, production: PRODUCTION_EN, open: OPEN_EN, platform: PLATFORM, system: SYSTEM, research: RESEARCH, jobs: JOBS, stack: STACK };
}
