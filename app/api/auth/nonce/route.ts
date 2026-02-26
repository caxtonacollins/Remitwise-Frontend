import { NextRequest, NextResponse } from "next/server";
import { storeNonce } from "@/lib/auth/nonce-store";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  const { publicKey } = await request.json();

  if (!publicKey) {
    return NextResponse.json(
      { error: "publicKey is required" },
      { status: 400 },
    );
  }

  // Generate a random nonce (32 bytes) and convert to hex
  const nonceBuffer = randomBytes(32);
  const nonce = nonceBuffer.toString("hex");

  // Store nonce in cache for later verification
  storeNonce(publicKey, nonce);

  return NextResponse.json({ nonce });
}
