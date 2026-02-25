import { NextResponse } from 'next/server'
import { getTranslator } from '../../../../lib/i18n'
import { buildCreatePolicyTx } from '../../../../lib/contracts/insurance'
import { StrKey } from '@stellar/stellar-sdk'

export async function POST(req: Request) {
  try {
    const t = getTranslator(req.headers.get('accept-language'));

    const caller = req.headers.get('x-user')
    if (!caller || !StrKey.isValidEd25519PublicKey(caller)) {
      return NextResponse.json({ error: t('errors.unauthorized_missing_header') }, { status: 401 })
    }

    const body = await req.json()
    const { name, coverageType, monthlyPremium, coverageAmount } = body || {}

    if (!name || typeof name !== 'string') return NextResponse.json({ error: t('errors.invalid_name') }, { status: 400 })
    if (!coverageType || typeof coverageType !== 'string') return NextResponse.json({ error: t('errors.invalid_coverage_type') }, { status: 400 })

    const mp = Number(monthlyPremium)
    const ca = Number(coverageAmount)
    if (!(mp > 0)) return NextResponse.json({ error: t('errors.invalid_monthly_premium') }, { status: 400 })
    if (!(ca > 0)) return NextResponse.json({ error: t('errors.invalid_coverage_amount') }, { status: 400 })

    const xdr = await buildCreatePolicyTx(caller, name, coverageType, mp, ca)
    return NextResponse.json({ xdr })
  } catch (err: any) {
    const t = getTranslator(req.headers.get('accept-language'));
    return NextResponse.json({ error: err?.message || t('errors.internal_server_error') }, { status: 500 })
  }
}
