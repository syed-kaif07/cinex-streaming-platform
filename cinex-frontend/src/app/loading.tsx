export default function Loading() {
  return (
    <div className="min-h-screen bg-cinex-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-cinex-red border-t-transparent rounded-full animate-spin" />
        <p className="text-[#b3b3b3] text-sm">Loading...</p>
      </div>
    </div>
  )
}
