/**
 * The glyphs for the Features rail.
 *
 * Lucide, at 20px on a 1.75 stroke rather than Lucide's default 2 — the heavier
 * default reads as a second type weight beside the rail's labels.
 *
 * Which glyph a group gets is decided in `featureIconMap.ts`, from the group's
 * own label. That mapping is covered by tests; this file only says what each key
 * looks like.
 */

import {
  Bell,
  CalendarDays,
  ChartColumn,
  CreditCard,
  FileCheck,
  FileText,
  GraduationCap,
  Plug,
  RefreshCw,
  Settings,
  ShieldCheck,
  Smartphone,
  Target,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { iconKeyFor, type IconKey } from "./featureIconMap";

const ICONS: Record<IconKey, LucideIcon> = {
  claims: FileCheck,
  money: CreditCard,
  shield: ShieldCheck,
  plug: Plug,
  chart: ChartColumn,
  workflow: Workflow,
  renew: RefreshCw,
  learn: GraduationCap,
  bell: Bell,
  calendar: CalendarDays,
  device: Smartphone,
  doc: FileText,
  target: Target,
  people: Users,
  gear: Settings,
};

export function FeatureIcon({ label }: { label: string }) {
  const Icon = ICONS[iconKeyFor(label)];
  return (
    <span aria-hidden="true" className="featrail__icon">
      <Icon size={20} strokeWidth={1.75} />
    </span>
  );
}
