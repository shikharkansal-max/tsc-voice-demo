import TSCLogo from '@/components/ui/TSCLogo'
import AgentAvatar from '@/components/ui/AgentAvatar'
import PhoneIcon from '@/components/ui/PhoneIcon'

export default function RightPanel() {
  return (
    <div className="bg-tsc-gray md:w-[55%] w-full flex items-center justify-center px-8 py-12 min-h-[calc(100vh-64px)]">
      {/* Agent Card */}
      <div className="bg-white rounded-3xl shadow-card-lg w-80 overflow-hidden flex flex-col items-center">
        {/* Card top gradient strip */}
        <div className="w-full h-2 bg-gradient-to-r from-tsc-green via-tsc-green-light to-tsc-red" />

        <div className="p-8 flex flex-col items-center gap-4 w-full">
          {/* Logo */}
          <TSCLogo variant="card" />

          {/* Avatar with live ping */}
          <div className="relative flex items-center justify-center mt-4">
            <div
              className="absolute rounded-full bg-tsc-green opacity-20 animate-ping"
              style={{ width: 112, height: 112 }}
            />
            <div
              className="absolute rounded-full bg-gradient-to-br from-tsc-green/10 to-tsc-red/10"
              style={{ width: 120, height: 120 }}
            />
            <AgentAvatar name="Riley" size={96} />
          </div>

          {/* Agent name */}
          <p className="text-tsc-black text-xl font-bold mt-2">Riley</p>

          {/* Language */}
          <p className="text-sm text-tsc-text-muted flex items-center gap-1.5">
            speaks <span className="font-semibold text-tsc-black">English</span>
          </p>

          {/* Voice pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-tsc-text-muted bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              Voice: Excited,
            </span>
            <span className="text-xs text-tsc-text-muted bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              Patient
            </span>
          </div>

          {/* Talk to Agent CTA */}
          <button className="bg-tsc-red hover:bg-tsc-red-dark text-white font-semibold rounded-full px-8 py-3 flex items-center justify-center gap-2 w-full transition-colors duration-200 shadow-md mt-4 cursor-pointer border-none">
            <PhoneIcon />
            Talk to Agent
          </button>
        </div>
      </div>
    </div>
  )
}
