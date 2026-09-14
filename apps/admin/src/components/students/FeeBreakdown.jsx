export function FeeBreakdown({ baseFee, scholarship, netPayable }) {
  return (
    <div className="card p-5 sm:p-6">
      <h3 className="text-sm font-bold text-foreground mb-4">Fee Breakdown</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Base Course Fee</span>
          <span className="font-medium text-foreground">
            ₹{baseFee.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-primary">
          <span>Applied Scholarship</span>
          <span className="font-medium">- ₹{scholarship.toLocaleString()}</span>
        </div>
        <div className="pt-3 flex justify-between border-t border-border mt-3 text-foreground font-bold text-base sm:text-lg">
          <span>Net Payable</span>
          <span>₹{netPayable.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
