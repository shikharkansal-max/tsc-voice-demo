import { NextRequest, NextResponse } from 'next/server'

const NURIX_API_URL = 'https://agentx-us.nurixlabs.tech/voice/outbound-call'
const WORKSPACE_ID = '8df3c72c-12a4-4b2b-8f6c-c15689e2cb8a'
const AGENT_ID = '7b186b5a-8e86-4eef-a8e7-092afdf61391'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phoneNumber, transferNumber } = body as {
      phoneNumber?: string
      transferNumber?: string
    }

    if (!phoneNumber) {
      return NextResponse.json({ error: 'phoneNumber is required' }, { status: 400 })
    }

    const res = await fetch(NURIX_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        workspace_id: WORKSPACE_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: AGENT_ID,
        number: phoneNumber,
        custom_dynamic_variables_config: {
          transfer_phone_number: transferNumber || '',
        },
        webhook_customer_id: phoneNumber,
      }),
    })

    const text = await res.text()
    let data: unknown
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Nurix API call failed', status: res.status, details: data },
        { status: res.status }
      )
    }

    return NextResponse.json({ ok: true, data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
