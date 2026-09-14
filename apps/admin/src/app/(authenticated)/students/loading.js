export default function StudentsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted rounded-lg" />
          <div className="h-4 w-64 bg-muted rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-lg shrink-0" />
      </div>

      {/* Search bar */}
      <div className="card p-4">
        <div className="h-10 w-full max-w-lg bg-muted rounded-lg" />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {/* Table header */}
        <div className="bg-muted/50 border-b border-border px-4 sm:px-6 py-4 grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 bg-muted rounded w-20" />
          ))}
        </div>
        {/* Table rows */}
        <div className="divide-y divide-border">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="px-4 sm:px-6 py-4 sm:py-5 grid grid-cols-5 gap-4 items-center"
            >
              <div className="h-4 w-36 bg-muted rounded" />
              <div className="h-4 w-44 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded ml-auto" />
              <div className="h-6 w-20 bg-muted rounded-full ml-auto" />
              <div className="h-7 w-7 bg-muted rounded-md mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
