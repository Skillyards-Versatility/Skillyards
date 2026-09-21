export function FeeStructureForm({ formData, setFormData }) {
  const fee = Number(formData.baseAmount) || 0;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold border-b border-border pb-2 text-foreground">
        Fee Assignment
      </h3>

      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
          Course Fee (₹)
        </label>
        <input
          type="number"
          required
          suppressHydrationWarning
          min="1"
          value={formData.baseAmount}
          onChange={(e) =>
            setFormData({ ...formData, baseAmount: e.target.value })
          }
          className="input font-bold text-foreground"
          placeholder="Total course fee"
        />
      </div>

      {fee > 0 && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <span className="text-sm font-bold text-foreground">
            Total Payable
          </span>
          <span className="text-xl font-bold text-primary">
            ₹{fee.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
