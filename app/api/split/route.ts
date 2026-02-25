import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { getTranslator } from '../../../lib/i18n';

export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie || sessionCookie.value !== 'mock-session-cookie') {
        const headersList = await headers();
        const t = getTranslator(headersList.get('accept-language'));
        return NextResponse.json({ error: t('errors.unauthorized') }, { status: 401 });
    }

    return NextResponse.json({
        allocations: {
            dailySpending: 50,
            savings: 30,
            bills: 15,
            insurance: 5
        }
    });
}
