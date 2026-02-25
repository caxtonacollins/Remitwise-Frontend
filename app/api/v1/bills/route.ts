import { NextResponse } from 'next/server'
import { getTranslator } from '../../../../lib/i18n'
import { buildCreateBillTx } from '../../../../lib/contracts/bill-payments'
import { StrKey } from '@stellar/stellar-sdk'

export async function POST(req: Request) {
  try {
    const t = getTranslator(req.headers.get('accept-language'));

    const caller = req.headers.get('x-user')
    if (!caller || !StrKey.isValidEd25519PublicKey(caller)) {
      return NextResponse.json({ error: t('errors.unauthorized_missing_header') }, { status: 401 })
    }

    const body = await req.json()
    const { name, amount, dueDate, recurring = false, frequencyDays } = body || {}

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: t('errors.invalid_name') }, { status: 400 })
    }
    const numAmount = Number(amount)
    if (!(numAmount > 0)) {
      return NextResponse.json({ error: t('errors.invalid_amount') }, { status: 400 })
    }
    if (recurring && !(frequencyDays && Number(frequencyDays) > 0)) {
      return NextResponse.json({ error: t('errors.invalid_frequency_days') }, { status: 400 })
    }
    if (!dueDate || Number.isNaN(Date.parse(dueDate))) {
      return NextResponse.json({ error: t('errors.invalid_due_date') }, { status: 400 })
    }

    const xdr = await buildCreateBillTx(caller, name, numAmount, dueDate, Boolean(recurring), frequencyDays ? Number(frequencyDays) : undefined)
    return NextResponse.json({ xdr })
  } catch (err: any) {
    const t = getTranslator(req.headers.get('accept-language'));
    return NextResponse.json({ error: err?.message || t('errors.internal_server_error') }, { status: 500 })
  }
}
