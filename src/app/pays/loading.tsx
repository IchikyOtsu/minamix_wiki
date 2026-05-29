export default function Loading() {
  return (
    <div>
      <div className="wiki-page-header">
        <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse mb-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-lg p-7 animate-pulse" style={{ backgroundColor: `hsl(${i * 60}, 15%, 88%)`, minHeight: '10rem' }}>
            <div className="h-6 w-32 bg-white/50 rounded-md mb-3" />
            <div className="space-y-2">
              <div className="h-3 bg-white/40 rounded w-full" />
              <div className="h-3 bg-white/40 rounded w-4/5" />
              <div className="h-3 bg-white/40 rounded w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
