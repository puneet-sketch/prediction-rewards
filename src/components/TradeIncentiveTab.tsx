import { useState } from 'react'
import {
  DollarSign,
  Shield,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  Info,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts'
import {
  tradeRewardBrackets,
  mmLevels,
  mmEligibility,
  newUserTradeData,
  mmUserTradeData,
  newUserLifetime,
  mmUserLifetime,
  type DayTrade,
} from '../data/mockData'

interface Props {
  isMarketMaker: boolean
  mmEnrolled: boolean
  onEnrollMM: () => void
}

export default function TradeIncentiveTab({ isMarketMaker, mmEnrolled, onEnrollMM }: Props) {
  const [mmInfoExpanded, setMmInfoExpanded] = useState(false)
  const [showLifetime, setShowLifetime] = useState(true)

  const tradeData: DayTrade[] = isMarketMaker ? mmUserTradeData : newUserTradeData
  const lifetime = isMarketMaker ? mmUserLifetime : newUserLifetime
  const totalTrades7d = tradeData.reduce((s, d) => s + d.trades, 0)
  const totalRewards7d = tradeData.filter((d) => !d.inProgress).reduce((s, d) => s + d.reward, 0)

  // MM eligibility check
  const daysAboveThreshold = tradeData.filter(
    (d) => !d.inProgress && d.trades >= mmEligibility.minDailyTrades
  ).length
  const isEligible =
    daysAboveThreshold >= mmEligibility.minDaysRequired ||
    lifetime.trades >= mmEligibility.altTotalTrades

  // Chart data (descending order)
  const chartData = [...tradeData].reverse().map((d) => ({
    date: d.date,
    trades: d.trades,
    inProgress: d.inProgress,
  }))

  // Table data (descending order)
  const tableData = [...tradeData].reverse()

  return (
    <div className="space-y-6">
      {/* Summary with Lifetime / 7d toggle */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-zinc-500">Total Trades</div>
            <div className="flex items-center bg-zinc-800 rounded-md p-0.5">
              <button
                onClick={() => setShowLifetime(true)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  showLifetime ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Lifetime
              </button>
              <button
                onClick={() => setShowLifetime(false)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  !showLifetime ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                7d
              </button>
            </div>
          </div>
          <div className="text-2xl font-semibold text-white font-mono">
            {(showLifetime ? lifetime.trades : totalTrades7d).toLocaleString()}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">
            Rewards earned {showLifetime ? '(lifetime)' : '(7d)'}
          </div>
          <div className="text-2xl font-semibold text-emerald-400 font-mono">
            ${(showLifetime ? lifetime.rewards : totalRewards7d).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Daily Reward Brackets — horizontal */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-1">Daily Reward Brackets</h3>
        <p className="text-xs text-zinc-500 mb-3">Hit a bracket each day to earn the reward.</p>
        <div className="grid grid-cols-4 gap-2">
          {tradeRewardBrackets.map((b, i) => {
            const today = tradeData[tradeData.length - 1]
            const reached = today.trades >= b.minTrades
            return (
              <div
                key={i}
                className={`rounded-lg border p-3 text-center ${
                  reached
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-zinc-800/30 border-zinc-800'
                }`}
              >
                <div className={`text-lg font-semibold font-mono ${reached ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  ${b.reward}
                </div>
                <div className={`text-[11px] mt-1 ${reached ? 'text-emerald-400/70' : 'text-zinc-600'}`}>
                  {b.label} trades
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 7-Day Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h3 className="text-sm font-medium text-white">Last 7 Days</h3>
        </div>
        <div className="px-4 pt-4 pb-2">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barCategoryGap="20%">
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 11 }}
                tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}K` : String(v))}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  background: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#a1a1aa' }}
                itemStyle={{ color: '#34d399' }}
                formatter={(value: number) => [value.toLocaleString(), 'Trades']}
              />
              <ReferenceLine
                y={1000}
                stroke="#3f3f46"
                strokeDasharray="3 3"
                label={{ value: '1K', fill: '#52525b', fontSize: 10, position: 'right' }}
              />
              <Bar dataKey="trades" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.inProgress ? '#6366f1' : entry.trades >= 1000 ? '#34d399' : '#3f3f46'}
                    fillOpacity={entry.inProgress ? 0.6 : 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
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
              {tableData.map((day, i) => (
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
                    {mmEligibility.altTotalTrades.toLocaleString()} total trades (lifetime)
                  </span>
                  <span
                    className={
                      lifetime.trades >= mmEligibility.altTotalTrades
                        ? 'text-emerald-400'
                        : 'text-zinc-500'
                    }
                  >
                    {lifetime.trades.toLocaleString()}/{mmEligibility.altTotalTrades.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div
                    className={`rounded-full h-1.5 transition-all ${
                      lifetime.trades >= mmEligibility.altTotalTrades
                        ? 'bg-emerald-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (lifetime.trades / mmEligibility.altTotalTrades) * 100)}%`,
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
              {/* Level cards — horizontal */}
              <div>
                <div className="text-xs text-zinc-500 mb-2">Daily liquidity rewards</div>
                <div className="grid grid-cols-5 gap-2">
                  {mmLevels.map((l) => (
                    <div
                      key={l.level}
                      className="bg-zinc-800/30 border border-zinc-800 rounded-lg p-2.5 text-center"
                    >
                      <div className="text-[10px] text-zinc-500 mb-1">L{l.level}</div>
                      <div className="text-sm font-semibold text-emerald-400 font-mono">
                        ${l.reward}
                      </div>
                      <div className="text-[10px] text-zinc-600 mt-1 font-mono">
                        {(l.target / 1000).toFixed(0)}K
                      </div>
                      {l.rebate > 0 && (
                        <div className="text-[10px] text-indigo-400 mt-0.5">
                          +{l.rebate}% rebate
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-[11px] text-zinc-500">
                <DollarSign className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
                <span>
                  We charge 10% commission on winnings. With commission rebate, {' '}
                  1% (Level 4) or 2% (Level 5) is deposited back to your wallet at end-of-day.
                  Same-price churn trades (±2¢ delta minimum) are excluded.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
