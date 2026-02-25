import { useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  Shield,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  Info,
} from 'lucide-react'
import {
  tradeRewardBrackets,
  mmLevels,
  mmEligibility,
  newUserTradeData,
  mmUserTradeData,
  type DayTrade,
} from '../data/mockData'

interface Props {
  isMarketMaker: boolean
  mmEnrolled: boolean
  onEnrollMM: () => void
}

export default function TradeIncentiveTab({ isMarketMaker, mmEnrolled, onEnrollMM }: Props) {
  const [mmInfoExpanded, setMmInfoExpanded] = useState(false)

  const tradeData: DayTrade[] = isMarketMaker ? mmUserTradeData : newUserTradeData
  const totalTrades7d = tradeData.reduce((s, d) => s + d.trades, 0)
  const totalRewards7d = tradeData.filter((d) => !d.inProgress).reduce((s, d) => s + d.reward, 0)

  // MM eligibility check
  const daysAboveThreshold = tradeData.filter(
    (d) => !d.inProgress && d.trades >= mmEligibility.minDailyTrades
  ).length
  const isEligible =
    daysAboveThreshold >= mmEligibility.minDaysRequired ||
    totalTrades7d >= mmEligibility.altTotalTrades

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">Trades (7d)</div>
          <div className="text-2xl font-semibold text-white font-mono">
            {totalTrades7d.toLocaleString()}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">Rewards earned (7d)</div>
          <div className="text-2xl font-semibold text-emerald-400 font-mono">
            ${totalRewards7d.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Reward Brackets */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h3 className="text-sm font-medium text-white">Daily Reward Brackets</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Hit a bracket each day to earn the reward.</p>
        </div>
        <div className="divide-y divide-zinc-800/60">
          {tradeRewardBrackets.map((b, i) => {
            const today = tradeData[tradeData.length - 1]
            const reached = today.trades >= b.minTrades
            return (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 ${reached ? 'bg-emerald-500/5' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${reached ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                  />
                  <span className="text-sm text-zinc-300">
                    {b.label} trades
                  </span>
                </div>
                <span
                  className={`text-sm font-medium font-mono ${reached ? 'text-emerald-400' : 'text-zinc-500'}`}
                >
                  ${b.reward}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 7-Day Activity */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h3 className="text-sm font-medium text-white">Last 7 Days</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 text-xs border-b border-zinc-800">
                <th className="px-4 py-2.5 text-left font-medium">Date</th>
                <th className="px-4 py-2.5 text-right font-medium">Trades</th>
                <th className="px-4 py-2.5 text-right font-medium">Reward</th>
                <th className="px-4 py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tradeData.map((day, i) => (
                <tr key={i} className="border-b border-zinc-800/40 last:border-0">
                  <td className="px-4 py-2.5 text-zinc-300">{day.date}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-zinc-200">
                    {day.trades.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    {day.reward > 0 ? (
                      <span className="text-emerald-400">${day.reward}</span>
                    ) : (
                      <span className="text-zinc-600">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {day.inProgress ? (
                      <span className="inline-flex items-center gap-1 text-xs text-indigo-400">
                        <Clock className="w-3 h-3" /> Live
                      </span>
                    ) : day.reward > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Credited
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-600">&mdash;</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Maker Section */}
      {mmEnrolled ? (
        <div className="bg-zinc-900 border border-indigo-500/30 rounded-lg p-4 flex items-center gap-3">
          <Shield className="w-5 h-5 text-indigo-400" />
          <span className="text-sm text-zinc-300">
            You are enrolled in the{' '}
            <span className="text-white font-medium">Market Maker Program</span>. Switch to
            the Market Maker tab to track your liquidity rewards.
          </span>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-4 py-4 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-medium text-white">Market Maker Program</h3>
              </div>
              {isEligible && (
                <button
                  onClick={onEnrollMM}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
                >
                  Enroll Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-1.5">
              Earn additional daily rewards by providing liquidity as a market maker.
            </p>
          </div>

          {/* Eligibility */}
          <div className="px-4 py-3 border-b border-zinc-800/60">
            <div className="text-xs text-zinc-500 mb-2.5">Eligibility</div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400">
                    {mmEligibility.minDailyTrades.toLocaleString()}+ trades/day for{' '}
                    {mmEligibility.minDaysRequired} days
                  </span>
                  <span
                    className={
                      daysAboveThreshold >= mmEligibility.minDaysRequired
                        ? 'text-emerald-400'
                        : 'text-zinc-500'
                    }
                  >
                    {daysAboveThreshold}/{mmEligibility.minDaysRequired} days
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div
                    className={`rounded-full h-1.5 transition-all ${
                      daysAboveThreshold >= mmEligibility.minDaysRequired
                        ? 'bg-emerald-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (daysAboveThreshold / mmEligibility.minDaysRequired) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-[10px] text-zinc-600 text-center">OR</div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400">
                    {mmEligibility.altTotalTrades.toLocaleString()} total trades (7d)
                  </span>
                  <span
                    className={
                      totalTrades7d >= mmEligibility.altTotalTrades
                        ? 'text-emerald-400'
                        : 'text-zinc-500'
                    }
                  >
                    {totalTrades7d.toLocaleString()}/{mmEligibility.altTotalTrades.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div
                    className={`rounded-full h-1.5 transition-all ${
                      totalTrades7d >= mmEligibility.altTotalTrades
                        ? 'bg-emerald-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (totalTrades7d / mmEligibility.altTotalTrades) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Expandable MM Details */}
          <button
            onClick={() => setMmInfoExpanded(!mmInfoExpanded)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            <span>Learn more about the Market Maker program</span>
            {mmInfoExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {mmInfoExpanded && (
            <div className="px-4 pb-4 space-y-4">
              {/* Level Table */}
              <div>
                <div className="text-xs text-zinc-500 mb-2">Daily liquidity rewards</div>
                <div className="border border-zinc-800 rounded-md overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-800 bg-zinc-800/30">
                        <th className="px-3 py-2 text-left font-medium">Level</th>
                        <th className="px-3 py-2 text-right font-medium">Maker Trades</th>
                        <th className="px-3 py-2 text-right font-medium">Reward</th>
                        <th className="px-3 py-2 text-right font-medium">Rebate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mmLevels.map((l) => (
                        <tr key={l.level} className="border-b border-zinc-800/40 last:border-0">
                          <td className="px-3 py-2 text-zinc-300">Level {l.level}</td>
                          <td className="px-3 py-2 text-right text-zinc-400 font-mono">
                            {l.target.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-right text-emerald-400 font-mono">
                            ${l.reward}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {l.rebate > 0 ? (
                              <span className="text-indigo-400">{l.rebate}%</span>
                            ) : (
                              <span className="text-zinc-600">&mdash;</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upgrade / Downgrade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-zinc-800 rounded-md p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-medium text-white">Upgrade</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Hit the next level&apos;s target for consecutive days to upgrade.
                  </p>
                  <div className="mt-2 space-y-1">
                    {mmLevels.slice(0, -1).map((l, i) => (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span className="text-zinc-500">
                          L{l.level} → L{l.level + 1}
                        </span>
                        <span className="text-zinc-400">
                          {mmLevels[i + 1].upgradeStreak} consecutive days
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-zinc-800 rounded-md p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-medium text-white">Downgrade</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Failing weekly retention drops you one level immediately. No grace period.
                  </p>
                  <div className="mt-2 space-y-1">
                    {mmLevels.map((l) => (
                      <div key={l.level} className="flex justify-between text-[11px]">
                        <span className="text-zinc-500">Level {l.level}</span>
                        <span className="text-zinc-400">
                          ≥ {l.retentionDays}/{l.retentionWindow} days or drop
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-[11px] text-zinc-500">
                <DollarSign className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
                <span>
                  Commission rebates of 1% (Level 4) and 2% (Level 5) on winnings commission,
                  credited end-of-day. Same-price churn trades (±2¢ delta minimum) are excluded.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
