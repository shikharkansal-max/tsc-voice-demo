type UsecaseCardProps = {
  title: string
  description: string
  isSelected: boolean
  onClick: () => void
}

export default function UsecaseCard({ title, description, isSelected, onClick }: UsecaseCardProps) {
  if (isSelected) {
    return (
      <li
        onClick={onClick}
        className="rounded-2xl p-5 cursor-pointer border-2 border-tsc-red bg-red-50/60 transition-all duration-200"
      >
        <p className="text-[15px] font-bold leading-tight text-tsc-red">
          {title}
        </p>
        <p className="text-[13px] mt-2 leading-relaxed text-gray-600">
          {description}
        </p>
      </li>
    )
  }

  return (
    <li
      onClick={onClick}
      className="py-4 cursor-pointer transition-all duration-200 hover:opacity-80"
    >
      <p className="text-[15px] font-bold leading-tight text-tsc-black">
        {title}
      </p>
      <p className="text-[13px] mt-2 leading-relaxed text-gray-500">
        {description}
      </p>
    </li>
  )
}
