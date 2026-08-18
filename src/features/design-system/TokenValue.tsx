"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reads a CSS custom property's computed value at runtime.
 *
 * Deliberately not hard-coded: the value shown is whatever the browser
 * resolves, so a token edited in tokens.css is reflected here without anyone
 * remembering to update the page. Reading from the element itself (not :root)
 * also surfaces per-tenant theme overrides.
 */
export function TokenValue({ token }: { token: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!ref.current) return;
    setValue(getComputedStyle(ref.current).getPropertyValue(token).trim());
  }, [token]);

  return (
    <span ref={ref} className="ds__value">
      {value || "—"}
    </span>
  );
}
