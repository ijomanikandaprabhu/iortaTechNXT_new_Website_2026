/**
 * Class-name joiner.
 *
 * shadcn components import `cn` from "@/lib/utils", normally implemented with
 * clsx + tailwind-merge. This project has no Tailwind, so there are no
 * conflicting utility classes to merge — a dependency-free join is enough and
 * keeps copied components working unmodified.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
