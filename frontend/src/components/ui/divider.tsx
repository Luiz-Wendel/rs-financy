/** Horizontal line with a centered label, e.g. "ou". */
export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-500" role="separator">
      <span className="h-px flex-1 bg-gray-300" />
      {label}
      <span className="h-px flex-1 bg-gray-300" />
    </div>
  )
}
