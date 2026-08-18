import { NextResponse, type NextRequest } from "next/server";
import { resolveTenant } from "@/core/tenancy/resolveTenant";
import { crmGateway } from "@/features/crm/api/crmGateway";
import { validateContactPayload } from "@/features/crm/validation";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Locale-independent on purpose: the locale travels in the payload, so there is
 * one endpoint rather than one per language.
 */
export async function POST(request: NextRequest) {
  const tenant = resolveTenant(request.headers.get("host"));

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = validateContactPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: "Validation failed", details: parsed.errors }, { status: 400 });
  }

  try {
    const result = await crmGateway.createContact({ ...parsed.value, tenant });
    return NextResponse.json({ id: result.id, provider: result.provider }, { status: 201 });
  } catch (error) {
    logger.error("crm.contact.failed", {
      tenant,
      message: error instanceof Error ? error.message : String(error),
    });
    // Never leak provider errors to the browser.
    return NextResponse.json({ error: "Unable to submit right now" }, { status: 502 });
  }
}
