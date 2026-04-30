type Props = { variant?: 'nav' | 'card' }

export default function TSCLogo({ variant = 'nav' }: Props) {
  if (variant === 'card') {
    return (
      <div className="flex flex-col items-center leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="text-tsc-red font-extrabold text-xl tracking-tight uppercase">
            Tractor
          </span>
          <span className="text-tsc-green font-extrabold text-xl tracking-tight uppercase">
            Supply
          </span>
        </div>
        <span className="text-xs text-tsc-text-muted font-medium tracking-widest uppercase mt-0.5">
          Company
        </span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-0.5">
      <span className="text-tsc-red font-extrabold text-xl tracking-tight">TSC</span>
      <span className="text-tsc-green-dark font-bold text-xl tracking-tight ml-1">|</span>
      <span className="text-tsc-black font-bold text-sm tracking-tight ml-1 uppercase">Tractor Supply</span>
    </div>
  )
}
