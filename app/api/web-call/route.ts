import { NextResponse } from 'next/server'

const NURIX_WEB_CALL_URL = 'https://agentx-us.nurixlabs.tech/voice/web/call'
const AGENT_ID = '7b186b5a-8e86-4eef-a8e7-092afdf61391'

function uuid() {
  // RFC4122 v4-ish — good enough for the user-id header
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const transferNumber: string = body?.transferNumber ?? ''

    const res = await fetch(NURIX_WEB_CALL_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'user-id': uuid(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: AGENT_ID,
        overide_previous_context: false,
        custom_dynamic_variables_config: {
          transfer_phone_number: transferNumber,
        },
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
        { error: 'Nurix web call API failed', status: res.status, details: data },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
