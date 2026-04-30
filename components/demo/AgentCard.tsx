'use client'
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import TalkToAgentModal from './TalkToAgentModal'

export default function AgentCard() {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <div
      className="flex flex-col items-center justify-between relative z-10 px-6 py-8 bg-white rounded-[28px] overflow-hidden"
      style={{
        width: 400,
        minHeight: 680,
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      {/* TSC Official Logo */}
      <div className="pt-2 flex items-center justify-center">
        <img
          src="/images/tsc-logo.png"
          alt="Tractor Supply Co."
          className="object-contain"
          style={{ height: 105, width: 'auto' }}
        />
      </div>

      {/* Center content: avatar + info */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Avatar with layered pink rings */}
        <div className="relative mb-8 flex justify-center items-center">
          <div className="relative" style={{ width: 260, height: 260 }}>
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full border-[3px] border-white"
              style={{
                background:
                  'radial-gradient(circle, rgba(251, 113, 133, 0.6) 0%, rgba(251, 113, 133, 0.3) 20%, rgba(255, 255, 255, 0.8) 100%)',
                boxShadow:
                  'rgba(227, 233, 248, 0.8) 0px 25px 50px, rgba(227, 233, 248, 0.6) 0px 15px 30px, rgba(227, 233, 248, 0.4) 0px 8px 20px, rgba(251, 113, 133, 0.3) 0px 4px 10px',
              }}
            />

            {/* Middle ring */}
            <div
              className="absolute rounded-full"
              style={{
                inset: 10,
                background:
                  'radial-gradient(circle, rgba(251, 113, 133, 0.4) 0%, rgba(251, 113, 133, 0.2) 20%, rgba(255, 255, 255, 0.9) 100%)',
              }}
            />

            {/* Avatar image — TSC employee */}
            <div
              className="absolute rounded-full overflow-hidden bg-white z-10 border-4 border-rose-200"
              style={{
                inset: 48,
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 40px, rgba(251, 113, 133, 0.2) 0px 8px 16px',
              }}
            >
              <img
                src="/images/tsc-agent.png"
                alt="Riley"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Inner shadow overlay */}
            <div
              className="absolute rounded-full z-20 pointer-events-none"
              style={{
                inset: 48,
                boxShadow: 'rgba(251, 113, 133, 0.1) 0px 0px 10px inset',
              }}
            />
          </div>
        </div>

        {/* Name + language + voice */}
        <div className="flex flex-col items-center text-center">
          <h1 className="font-normal text-black leading-tight" style={{ fontSize: 30 }}>Riley</h1>
          <h2 className="text-black/80 mt-2" style={{ fontSize: 18 }}>speaks English</h2>
          <span
            className="text-black/60 mt-4 leading-relaxed"
            style={{ fontSize: 14, whiteSpace: 'pre-line' }}
          >
            {'Voice: Friendly,\nHelpful'}
          </span>
        </div>
      </div>

      {/* CTA button */}
      <div className="mt-6 pb-4">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center text-white justify-center gap-2.5 rounded-[40px] transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
          style={{
            background: '#da3832',
            border: '1px solid #EBEAEA',
            fontSize: 15,
            padding: '12px 28px',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>Talk to Agent</span>
        </button>
      </div>

      <TalkToAgentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
