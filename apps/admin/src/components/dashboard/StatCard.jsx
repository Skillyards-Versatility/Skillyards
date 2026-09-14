export function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="card p-5 sm:p-6 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
          {value}
        </p>
      </div>
      <div className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
