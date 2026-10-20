"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Calculator,
  Trophy,
  Sparkles,
  TrendingUp,
  Award,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export function CommissionCalculatorModal({ isOpen, onClose, initialAdmissions = 12 }) {
  const [admissions, setAdmissions] = useState(initialAdmissions);

  useEffect(() => {
    if (isOpen) {
      setAdmissions(initialAdmissions);
    }
  }, [isOpen, initialAdmissions]);

  // Calculate tier breakdown
  const breakdown = useMemo(() => {
    let count = Number(admissions) || 0;
    let t1Count = Math.min(count, 5);
    let t1Amount = t1Count * 1500;
    count -= t1Count;

    let t2Count = 0;
    let t2Amount = 0;
    if (count > 0) {
      t2Count = Math.min(count, 5);
      t2Amount = t2Count * 2500;
      count -= t2Count;
    }

    let t3Count = 0;
    let t3Amount = 0;
    if (count > 0) {
      t3Count = Math.min(count, 5);
      t3Amount = t3Count * 3500;
      count -= t3Count;
    }

    let t4Count = 0;
    let t4Amount = 0;
    let bonusAmount = 0;
    if (count > 0) {
      t4Count = count;
      t4Amount = t4Count * 5000;
      bonusAmount = 10000;
    }

    const totalPayout = t1Amount + t2Amount + t3Amount + t4Amount + bonusAmount;
    const estimatedRevenue = Number(admissions) * 45135;

    return {
      t1Count,
      t1Amount,
      t2Count,
      t2Amount,
      t3Count,
      t3Amount,
      t4Count,
      t4Amount,
      bonusAmount,
      totalPayout,
      estimatedRevenue,
      isSuperAchiever: Number(admissions) >= 16,
    };
  }, [admissions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FAF6EE] rounded-2xl shadow-2xl border border-[rgba(71,86,87,0.22)] overflow-hidden my-8">
        
        {/* Cockpit Top Bar */}
        <div className="bg-[#0c1316] text-white px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2E7559]/20 border border-[#2E7559]/40 flex items-center justify-center text-[#2E7559]">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">Interactive Commission Calculator</h2>
              <p className="text-[11px] text-[#7E939A]">Slab-Based Sales Incentive Simulator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#7E939A] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-[#1C2527]">
          
          {/* Interactive Range Slider */}
          <div className="p-4 bg-white rounded-2xl border border-[rgba(71,86,87,0.18)] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1C2527] flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#B07238]" />
                <span>Projected Monthly Closed Admissions:</span>
              </label>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={admissions}
                  onChange={(e) => setAdmissions(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 px-2 py-1 text-center font-mono font-black text-lg text-[#2E7559] rounded-xl border border-[rgba(71,86,87,0.2)] bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#2E7559]"
                />
                <span className="text-xs text-[#5A6E71] font-bold">Students</span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="30"
              value={admissions}
              onChange={(e) => setAdmissions(parseInt(e.target.value))}
              className="w-full h-2.5 bg-[#FAF6EE] rounded-lg appearance-none cursor-pointer accent-[#2E7559] border border-[rgba(71,86,87,0.15)]"
            />

            <div className="flex justify-between text-[10px] text-[#7E939A] font-bold font-mono">
              <span>0 (Base)</span>
              <span>Tier 1 (5)</span>
              <span>Tier 2 (10)</span>
              <span>Tier 3 (15)</span>
              <span className="text-[#2E7559]">Super Achiever (16+)</span>
            </div>
          </div>

          {/* Grand Payout Summary Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FAF6EE] via-[#E8F4EE] to-[#FAF6EE] border border-[#2E7559]/30 text-center space-y-1 shadow-xs relative overflow-hidden">
            {breakdown.isSuperAchiever && (
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2E7559] text-white text-[10px] font-bold shadow-xs">
                <Sparkles className="w-3 h-3" />
                <span>₹10,000 Mega Bonus Unlocked!</span>
              </div>
            )}
            <span className="text-[11px] font-bold text-[#5A6E71] uppercase tracking-wider block">
              Projected Total Take-Home Commission Payout
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#2E7559] font-mono tracking-tight">
              ₹{breakdown.totalPayout.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-[#5A6E71] mt-1 font-medium">
              Generating estimated <strong className="text-[#1C2527]">₹{(breakdown.estimatedRevenue / 100000).toFixed(2)} Lakhs</strong> in gross tuition revenue
            </p>
          </div>

          {/* Slabs Breakdown Ledger */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7E939A] block">
              Slab-by-Slab Earnings Breakdown
            </span>

            <div className="bg-white rounded-2xl border border-[rgba(71,86,87,0.16)] divide-y divide-[rgba(71,86,87,0.1)] text-xs overflow-hidden">
              {/* Tier 1 */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#1C2527]">Tier 1: Kickoff (1 to 5 Admissions)</p>
                  <p className="text-[11px] text-[#7E939A]">Rate: ₹1,500 per enrollment • {breakdown.t1Count} achieved</p>
                </div>
                <span className="font-mono font-bold text-xs text-[#1C2527]">
                  ₹{breakdown.t1Amount.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Tier 2 */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#1C2527]">Tier 2: Growth (6 to 10 Admissions)</p>
                  <p className="text-[11px] text-[#7E939A]">Rate: ₹2,500 per enrollment • {breakdown.t2Count} achieved</p>
                </div>
                <span className="font-mono font-bold text-xs text-[#1C2527]">
                  ₹{breakdown.t2Amount.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Tier 3 */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#1C2527]">Tier 3: Accelerator (11 to 15 Admissions)</p>
                  <p className="text-[11px] text-[#7E939A]">Rate: ₹3,500 per enrollment • {breakdown.t3Count} achieved</p>
                </div>
                <span className="font-mono font-bold text-xs text-[#1C2527]">
                  ₹{breakdown.t3Amount.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Tier 4 */}
              <div className="p-3 flex items-center justify-between bg-[#2E7559]/5">
                <div>
                  <p className="font-bold text-[#2E7559] flex items-center gap-1">
                    <span>Tier 4: Super Achiever (&gt;15 Admissions)</span>
                    <Sparkles className="w-3 h-3 text-[#2E7559]" />
                  </p>
                  <p className="text-[11px] text-[#5A6E71]">
                    Rate: ₹5,000 per enrollment • {breakdown.t4Count} achieved
                    {breakdown.bonusAmount > 0 && " + ₹10,000 Mega Milestone Bonus"}
                  </p>
                </div>
                <span className="font-mono font-bold text-sm text-[#2E7559]">
                  ₹{(breakdown.t4Amount + breakdown.bonusAmount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-[#F4ECDF] border-t border-[rgba(71,86,87,0.18)] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0c1316] hover:bg-[#152024] text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
