import { NextRequest, NextResponse } from "next/server";
import { getTranslator } from "@/lib/i18n";
import { getActivePolicies } from "@/lib/contracts/insurance";
import { validateAuth, unauthorizedResponse } from "@/lib/auth";

// GET /api/insurance
// Returns active policies for the authenticated owner.
// Query param: ?owner=G... (Stellar account address)
export async function GET(request: NextRequest) {
  if (!validateAuth(request)) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");

  if (!owner) {
    const t = getTranslator(request.headers.get("accept-language"));
    return NextResponse.json(
      { error: t("errors.missing_query_owner") },
      { status: 400 }
    );
  }

  try {
    const policies = await getActivePolicies(owner);
    return NextResponse.json({ policies });
  } catch (error: unknown) {
    const err = error as { code?: string };

    if (err.code === "INVALID_ADDRESS") {
      const t = getTranslator(request.headers.get("accept-language"));
      return NextResponse.json({ error: t("errors.invalid_stellar_address") }, { status: 400 });
    }

    console.error("[GET /api/insurance]", error);
    const t = getTranslator(request.headers.get("accept-language"));
    return NextResponse.json(
      { error: t("errors.failed_fetch_policies") },
      { status: 502 }
    );
  }
}