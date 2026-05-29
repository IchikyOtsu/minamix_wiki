export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-10 w-40 bg-gray-200 rounded-lg mb-6" />
      <div className="wiki-card p-6 mb-6">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
      <div className="space-y-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="wiki-card p-6">
            <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-4/5" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
