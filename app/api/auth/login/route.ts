import { NextResponse } from 'next/server';
import { getTranslator } from '@/lib/i18n';
import { Keypair } from '@stellar/stellar-sdk';
import { getAndClearNonce } from '@/lib/auth-cache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, signature } = body;

    if (!address || !signature) {
      const t = getTranslator(request.headers.get('accept-language'));
      return NextResponse.json(
        { error: t('errors.address_signature_required') },
        { status: 400 }
      );
    }

    // Retrieve and clear nonce — returns null if missing or expired
    const nonce = getAndClearNonce(address);
    if (!nonce) {
      const t = getTranslator(request.headers.get('accept-language'));
      return NextResponse.json(
        { error: t('errors.nonce_expired') },
        { status: 401 }
      );
    }

    // Verify signature
    try {
      const keypair = Keypair.fromPublicKey(address);
      // Nonce is stored as hex string; signature is base64 from the client.
      const isValid = keypair.verify(
        Buffer.from(nonce, 'hex'),
        Buffer.from(signature, 'base64')
      );

      if (!isValid) {
        const t = getTranslator(request.headers.get('accept-language'));
        return NextResponse.json({ error: t('errors.invalid_signature') }, { status: 401 });
      }
    } catch {
      const t = getTranslator(request.headers.get('accept-language'));
      return NextResponse.json(
        { error: t('errors.signature_verification_failed') },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true, token: 'mock-session-token' });
    response.cookies.set('session', 'mock-session-cookie', { httpOnly: true, path: '/' });
    return response;

  } catch {
    const t = getTranslator(request.headers.get('accept-language'));
    return NextResponse.json({ error: t('errors.bad_request') }, { status: 400 });
  }
}