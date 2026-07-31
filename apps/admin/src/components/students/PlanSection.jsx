import { Pencil } from "lucide-react";

export function PlanSection({ plan, onAssignPlan, onEditPlan, canEdit }) {
  if (!plan) {
    return (
      <div className="card p-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">No fee plan assigned yet.</p>
        {onAssignPlan && (
          <button
            onClick={onAssignPlan}
            className="shrink-0 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90"
          >
            Assign Plan
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card p-5 sm:p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Fee Plan
        </h3>

        <div className="flex items-center gap-2">
          {canEdit && onEditPlan && (
            <button
              onClick={onEditPlan}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border rounded-lg transition-colors"
              title="Edit Plan"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
          )}
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20">
            {plan.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        
        <div>
          <p className="text-muted-foreground text-xs mb-1">Total Amount</p>
          <p className="font-semibold text-foreground">
            ₹{plan.total.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground text-xs mb-1">Installments</p>
          <p className="font-semibold text-foreground">
            {plan.installments}
          </p>
        </div>

        {plan.startDate && (
          <div>
            <p className="text-muted-foreground text-xs mb-1">Start Date</p>
            <p className="font-semibold text-foreground">
              {plan.startDate}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
