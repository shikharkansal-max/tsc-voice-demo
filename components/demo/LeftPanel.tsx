'use client'

import { useState } from 'react'
import UsecaseCard from '@/components/demo/UsecaseCard'

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

export default function LeftPanel() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="md:w-[45%] w-full flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero section — gradient background */}
      <div className="bg-gradient-to-r from-tsc-green-dark via-tsc-green to-tsc-red px-10 py-12 flex-shrink-0">
        <h1 className="text-white text-3xl font-extrabold leading-tight mb-6">
          Experience<br />our Voice Agents
        </h1>

        {/* Company badge */}
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
            </svg>
          </span>
          <span className="text-white font-bold text-base">Tractor Supply Co.</span>
        </div>
      </div>

      {/* Usecases section — white background like Nurix */}
      <div className="bg-white px-10 py-8 flex-1">
        <p className="text-tsc-text-muted text-xs font-semibold uppercase tracking-wider mb-4">
          Select Usecase
        </p>

        <ul className="flex flex-col gap-3 list-none m-0 p-0">
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
  )
}
