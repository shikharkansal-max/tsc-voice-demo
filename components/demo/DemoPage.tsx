'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import UsecaseCard from '@/components/demo/UsecaseCard'
import AgentCard from '@/components/demo/AgentCard'

const USECASES = [
  {
    title: 'Farm Supply Ordering',
    description: 'Empathetic voice agent for ordering farm supplies, livestock feed, and scheduling delivery',
  },
  {
    title: 'Product Availability Check',
    description: 'AI voice agent to check stock and find nearest store location',
  },
  {
    title: "Loyalty Program – Neighbor's Club",
    description: "Voice agent for Neighbor's Club member services and rewards",
  },
]

export default function DemoPage() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 relative overflow-hidden">
        {/* ===== HERO + CARD ROW ===== */}
        <div className="relative">

          {/* Green-to-red gradient bg — covers left ~60% */}
          <div
            className="absolute top-0 left-0 bottom-0"
            style={{
              width: '100%',
              background: '#da3832',
              borderBottomRightRadius: '16px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-[1100px] mx-auto px-10">
            {/* Left — text in the red zone */}
            <div className="pt-12 pb-10" style={{ maxWidth: '55%' }}>
              <h1 className="text-white text-[36px] font-extrabold leading-[1.2] mb-8">
                Experience<br />our Voice Agents
              </h1>

              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
                  </svg>
                </span>
                <span className="text-white font-bold text-base">Tractor Supply Co.</span>
              </div>
            </div>

            {/* Agent card — absolutely positioned on the right, doesn't stretch hero */}
            <div className="absolute top-6 right-10 z-20">
              <AgentCard />
            </div>
          </div>
        </div>

        {/* ===== USECASE SECTION (white bg, below hero) ===== */}
        <div className="relative z-0 bg-white">
          <div className="max-w-[1100px] mx-auto px-10">
            <div className="max-w-[500px] pt-8 pb-16">
              <p className="text-tsc-text-muted text-sm font-medium mb-5">
                Select Usecase
              </p>

              <ul className="flex flex-col gap-2 list-none m-0 p-0">
                {USECASES.map((uc, i) => (
                  <UsecaseCard
                    key={uc.title}
                    title={uc.title}
                    description={uc.description}
                    isSelected={selectedIndex === i}
                    onClick={() => setSelectedIndex(i)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
