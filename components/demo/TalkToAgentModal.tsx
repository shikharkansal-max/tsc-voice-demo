'use client'

import { useState } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

// Calls our local Next.js API route which proxies to the Nurix outbound-call API
// (avoids CORS + keeps workspace_id server-side)
const API_URL = '/api/outbound-call'

export default function TalkToAgentModal({ isOpen, onClose }: Props) {
  const [phoneNumber, setPhoneNumber] = useState('+91')
  const [transferNumber, setTransferNumber] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, transferNumber }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Request failed: ${res.status}`)
      }

      setStatus('success')
      setTimeout(() => {
        onClose()
        setStatus('idle')
        setPhoneNumber('+91')
        setTransferNumber('')
      }, 2500)
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Failed to initiate call')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-md relative"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl bg-transparent border-none cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          type="button"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3"
            style={{ background: '#fee2e2' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#da3832" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Talk to Riley</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your number — Riley will call you within seconds</p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">Call initiated!</p>
            <p className="text-sm text-gray-500 mt-1">Riley is calling you now</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Phone Number
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] outline-none focus:border-tsc-red focus:ring-2 focus:ring-red-100 transition-colors"
                disabled={status === 'loading'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Transfer Phone Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={transferNumber}
                onChange={(e) => setTransferNumber(e.target.value)}
                placeholder="Transfer to a human agent if needed"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] outline-none focus:border-tsc-red focus:ring-2 focus:ring-red-100 transition-colors"
                disabled={status === 'loading'}
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Leave blank to disable call transfer
              </p>
            </div>

            {status === 'error' && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-sm text-red-700">
                  <strong>Couldn&apos;t start call:</strong> {errorMsg}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3.5 rounded-full text-white font-semibold cursor-pointer border-none transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: '#da3832', fontSize: 15 }}
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Call Me Now
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              Standard call rates may apply
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
