type Props = { src?: string; name?: string; size?: number }

export default function AgentAvatar({ src, name = 'Riley', size = 96 }: Props) {
  const initials = name.charAt(0).toUpperCase()
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover border-4 border-white shadow-card"
      />
    )
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full border-4 border-white shadow-card flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-300 text-amber-800 font-bold text-3xl select-none"
    >
      {initials}
    </div>
  )
}
