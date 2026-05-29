export default function Loading() {
  return (
    <div>
      <div className="wiki-page-header">
        <div className="h-10 w-44 bg-gray-200 rounded-lg animate-pulse mb-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="rounded-lg p-7 animate-pulse" style={{ backgroundColor: `hsl(${i * 45}, 30%, 75%)`, minHeight: '9rem' }}>
            <div className="flex justify-between items-start mb-3">
              <div className="h-6 w-24 bg-white/40 rounded-md" />
              <div className="h-5 w-16 bg-white/30 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 bg-white/30 rounded w-full" />
              <div className="h-3 bg-white/30 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
