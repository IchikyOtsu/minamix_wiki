export default function Loading() {
  return (
    <div>
      <div className="wiki-page-header">
        <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse mb-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-lg p-7 animate-pulse" style={{ backgroundColor: `hsl(${i * 80 + 20}, 20%, 88%)`, minHeight: '10rem' }}>
            <div className="flex justify-between mb-3">
              <div className="h-5 w-28 bg-white/50 rounded-md" />
              <div className="h-5 w-20 bg-white/40 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-white/40 rounded w-full" />
              <div className="h-3 bg-white/40 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
