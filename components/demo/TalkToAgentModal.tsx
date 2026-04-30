'use client'

import { useState, useRef, useEffect } from 'react'
import { Room, RoomEvent, Track, type RemoteTrack, type RemoteTrackPublication, type RemoteParticipant } from 'livekit-client'

type Props = {
  isOpen: boolean
  onClose: () => void
}

type Mode = 'web' | 'phone'
type CallStatus = 'idle' | 'connecting' | 'in-call' | 'ended' | 'error'

export default function TalkToAgentModal({ isOpen, onClose }: Props) {
  const [mode, setMode] = useState<Mode>('web')
  const [transferNumber, setTransferNumber] = useState('')

  // Phone call
  const [phoneNumber, setPhoneNumber] = useState('+91')
  const [phoneStatus, setPhoneStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [phoneError, setPhoneError] = useState('')

  // Web call
  const [webStatus, setWebStatus] = useState<CallStatus>('idle')
  const [webError, setWebError] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const roomRef = useRef<Room | null>(null)
  const audioElRef = useRef<HTMLDivElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Cleanup on unmount or close
  useEffect(() => {
    if (!isOpen) {
      hangup()
    }
    return () => { hangup() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  function startTimer() {
    setCallDuration(0)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000)
  }
  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  async function startWebCall() {
    setWebStatus('connecting')
    setWebError('')

    try {
      const res = await fetch('/api/web-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transferNumber }),
      })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || `HTTP ${res.status}`)
      }
      const { serverUrl, participantToken } = await res.json()

      const room = new Room({ adaptiveStream: true, dynacast: true })
      roomRef.current = room

      room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _pub: RemoteTrackPublication, _participant: RemoteParticipant) => {
        void _pub; void _participant;
        if (track.kind === Track.Kind.Audio && audioElRef.current) {
          const el = track.attach() as HTMLAudioElement
          el.autoplay = true
          audioElRef.current.appendChild(el)
        }
      })

      room.on(RoomEvent.Disconnected, () => {
        stopTimer()
        setWebStatus((s) => (s === 'in-call' ? 'ended' : s))
        roomRef.current = null
      })

      await room.connect(serverUrl, participantToken)
      await room.localParticipant.setMicrophoneEnabled(true)

      setWebStatus('in-call')
      startTimer()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to start web call'
      setWebError(message)
      setWebStatus('error')
      hangup()
    }
  }

  function hangup() {
    stopTimer()
    if (roomRef.current) {
      try { roomRef.current.disconnect() } catch {}
      roomRef.current = null
    }
    if (audioElRef.current) audioElRef.current.innerHTML = ''
    setIsMuted(false)
  }

  async function toggleMute() {
    if (!roomRef.current) return
    const next = !isMuted
    await roomRef.current.localParticipant.setMicrophoneEnabled(!next)
    setIsMuted(next)
  }

  async function submitPhoneCall(e: React.FormEvent) {
    e.preventDefault()
    setPhoneStatus('loading')
    setPhoneError('')
    try {
      const res = await fetch('/api/outbound-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, transferNumber }),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || `HTTP ${res.status}`)
      }
      setPhoneStatus('success')
      setTimeout(() => {
        onClose()
        setPhoneStatus('idle')
      }, 2500)
    } catch (err: unknown) {
      setPhoneStatus('error')
      setPhoneError(err instanceof Error ? err.message : 'Failed')
    }
  }

  function fmtDuration(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  function handleClose() {
    hangup()
    setWebStatus('idle')
    setPhoneStatus('idle')
    setPhoneError('')
    setWebError('')
    setPhoneNumber('+91')
    setTransferNumber('')
    onClose()
  }

  if (!isOpen) return null

  const inWebCall = webStatus === 'connecting' || webStatus === 'in-call'

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={!inWebCall ? handleClose : undefined}
    >
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-md relative"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {!inWebCall && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl bg-transparent border-none cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        )}

        {/* Hidden audio container */}
        <div ref={audioElRef} style={{ display: 'none' }} />

        {/* Header */}
        <div className="text-center mb-5">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3"
            style={{ background: '#fee2e2' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#da3832" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Talk to Riley</h2>
        </div>

        {/* IN-CALL UI */}
        {inWebCall ? (
          <div className="text-center py-2">
            <div className="mb-4">
              {webStatus === 'connecting' ? (
                <p className="text-sm text-gray-500">Connecting…</p>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-semibold text-green-700">LIVE · {fmtDuration(callDuration)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">You&apos;re talking to Riley</p>
                </>
              )}
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={toggleMute}
                disabled={webStatus !== 'in-call'}
                className="w-14 h-14 rounded-full border-none cursor-pointer flex items-center justify-center transition-all disabled:opacity-50"
                style={{
                  background: isMuted ? '#fee2e2' : '#f3f4f6',
                  color: isMuted ? '#dc2626' : '#374151',
                }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" /><line x1="12" y1="19" x2="12" y2="23" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => { hangup(); setWebStatus('ended') }}
                className="px-6 h-14 rounded-full border-none cursor-pointer flex items-center justify-center gap-2 text-white font-semibold"
                style={{ background: '#da3832', fontSize: 14 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(135deg)' }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                End Call
              </button>
            </div>
          </div>
        ) : webStatus === 'ended' ? (
          <div className="text-center py-4">
            <p className="text-lg font-semibold text-gray-900">Call ended</p>
            <p className="text-sm text-gray-500 mt-1">Duration {fmtDuration(callDuration)}</p>
            <button
              onClick={handleClose}
              className="mt-6 px-6 py-2 rounded-full border border-gray-200 bg-white cursor-pointer text-sm font-semibold"
            >
              Close
            </button>
          </div>
        ) : phoneStatus === 'success' ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">Call initiated!</p>
            <p className="text-sm text-gray-500 mt-1">Riley is calling {phoneNumber}</p>
          </div>
        ) : (
          <>
            {/* Tab switcher */}
            <div className="flex p-1 bg-gray-100 rounded-full mb-5">
              <button
                onClick={() => setMode('web')}
                className={`flex-1 py-2 rounded-full text-sm font-semibold cursor-pointer border-none transition-all ${mode === 'web' ? 'bg-white shadow' : 'text-gray-500 bg-transparent'}`}
              >
                💻 Talk in Browser
              </button>
              <button
                onClick={() => setMode('phone')}
                className={`flex-1 py-2 rounded-full text-sm font-semibold cursor-pointer border-none transition-all ${mode === 'phone' ? 'bg-white shadow' : 'text-gray-500 bg-transparent'}`}
              >
                📞 Call My Phone
              </button>
            </div>

            {mode === 'web' ? (
              <div>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Click below to start a voice call directly from your browser. Make sure your microphone is enabled.
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Transfer Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={transferNumber}
                    onChange={(e) => setTransferNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] outline-none focus:border-tsc-red transition-colors"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    Riley can transfer to a human at this number
                  </p>
                </div>

                {webStatus === 'error' && (
                  <div className="p-3 mb-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-sm text-red-700">
                      <strong>Couldn&apos;t start call:</strong> {webError}
                    </p>
                  </div>
                )}

                <button
                  onClick={startWebCall}
                  className="w-full py-3.5 rounded-full text-white font-semibold cursor-pointer border-none transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  style={{ background: '#da3832', fontSize: 15 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" />
                  </svg>
                  Start Call
                </button>
              </div>
            ) : (
              <form onSubmit={submitPhoneCall}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] outline-none focus:border-tsc-red transition-colors"
                    disabled={phoneStatus === 'loading'}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Transfer Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={transferNumber}
                    onChange={(e) => setTransferNumber(e.target.value)}
                    placeholder="Transfer to human if needed"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] outline-none focus:border-tsc-red transition-colors"
                    disabled={phoneStatus === 'loading'}
                  />
                </div>

                {phoneStatus === 'error' && (
                  <div className="p-3 mb-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-sm text-red-700">
                      <strong>Couldn&apos;t start call:</strong> {phoneError}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={phoneStatus === 'loading'}
                  className="w-full py-3.5 rounded-full text-white font-semibold cursor-pointer border-none transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: '#da3832', fontSize: 15 }}
                >
                  {phoneStatus === 'loading' ? 'Connecting…' : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      Call Me Now
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
