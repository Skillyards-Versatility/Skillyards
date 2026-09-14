export default function StudentDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-muted rounded-lg shrink-0" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-4 w-36 bg-muted rounded" />
          </div>
        </div>
        <div className="h-9 w-32 bg-muted rounded-lg shrink-0" />
      </div>

      {/* Ledger Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-8 w-28 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Plan Section */}
      <div className="card p-5 sm:p-6 flex items-center justify-between">
        <div className="h-4 w-40 bg-muted rounded" />
        <div className="h-8 w-28 bg-muted rounded-lg" />
      </div>

      {/* Installments Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="h-4 w-28 bg-muted rounded" />
        </div>
        <div className="divide-y divide-border">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-6">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-7 w-28 bg-muted rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="h-4 w-28 bg-muted rounded" />
        </div>
        <div className="divide-y divide-border">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-6">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-6 w-14 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-7 w-40 bg-muted rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
