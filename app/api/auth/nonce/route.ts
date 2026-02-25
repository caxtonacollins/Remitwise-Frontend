import { NextResponse } from 'next/server';
import { getTranslator } from '@/lib/i18n';
import crypto from 'crypto';
import { setNonce } from '@/lib/auth-cache';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address');

        if (!address) {
            const t = getTranslator(request.headers.get('accept-language'));
            return NextResponse.json({ error: t('errors.address_required') }, { status: 400 });
        }

        // Generate a secure random 32-byte nonce and convert to hex
        const nonce = crypto.randomBytes(32).toString('hex');

        // Store in our temporary cache
        setNonce(address, nonce);

        return NextResponse.json({ nonce });
    } catch (error) {
        const t = getTranslator(request.headers.get('accept-language'));
        return NextResponse.json({ error: t('errors.internal_server_error') }, { status: 500 });
    }
}
