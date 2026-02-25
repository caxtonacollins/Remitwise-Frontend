import { NextResponse } from 'next/server'
import { buildPayBillTx } from '../../../../../../lib/contracts/bill-payments'
import { StrKey } from '@stellar/stellar-sdk'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: billId } = await params
    const caller = req.headers.get('x-user')
    if (!caller || !StrKey.isValidEd25519PublicKey(caller)) {
      return NextResponse.json({ error: 'Unauthorized: missing or invalid x-user header' }, { status: 401 })
    }

    if (!billId) return NextResponse.json({ error: 'Missing bill id' }, { status: 400 })

    const xdr = await buildPayBillTx(caller, billId)
    return NextResponse.json({ xdr })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
