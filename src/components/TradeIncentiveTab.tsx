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
  Target,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import {
  tradeRewardBrackets,
  mmRewardBrackets,
  mmEligibility,
  newUserTradeData,
  mmUserTradeData,
  newUserLifetime,
  mmUserLifetime,
  type DayTrade,
} from '../data/mockData'

type TimeFilter = '1d' | '7d' | 'lifetime'

interface Props {
  isMarketMaker: boolean
  mmEnrolled: boolean
  onEnrollMM: () => void
}

export default function TradeIncentiveTab({ isMarketMaker, mmEnrolled, onEnrollMM }: Props) {
  const [mmInfoExpanded, setMmInfoExpanded] = useState(false)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('1d')

  const tradeData: DayTrade[] = isMarketMaker ? mmUserTradeData : newUserTradeData
  const lifetime = isMarketMaker ? mmUserLifetime : newUserLifetime
  const today = tradeData[tradeData.length - 1]

  const entryTrades7d = tradeData.reduce((s, d) => s + d.entryTrades, 0)
  const exitTrades7d = tradeData.reduce((s, d) => s + d.exitTrades, 0)
  const totalRewards7d = tradeData.filter((d) => !d.inProgress).reduce((s, d) => s + d.reward, 0)

  // Time-filtered values
  const entryTradesDisplay =
    timeFilter === '1d' ? today.entryTrades :
    timeFilter === '7d' ? entryTrades7d : lifetime.entryTrades
  const exitTradesDisplay =
    timeFilter === '1d' ? today.exitTrades :
    timeFilter === '7d' ? exitTrades7d : lifetime.exitTrades
  const rewardsDisplay =
    timeFilter === '1d' ? (today.inProgress ? 0 : today.reward) :
    timeFilter === '7d' ? totalRewards7d : lifetime.rewards

  // Bracket logic — only the highest reached bracket counts
  const currentBracketIndex = tradeRewardBrackets.reduce(
    (highest, b, i) => (today.entryTrades >= b.minTrades ? i : highest), -1
  )
  const currentReward = currentBracketIndex >= 0 ? tradeRewardBrackets[currentBracketIndex].reward : 0
  const nextBracket = currentBracketIndex < tradeRewardBrackets.length - 1
    ? tradeRewardBrackets[currentBracketIndex + 1]
    : null
  const tradesToNext = nextBracket ? nextBracket.minTrades - today.entryTrades : 0

  // MM eligibility check (uses entry trades)
  const daysAboveThreshold = tradeData.filter(
    (d) => !d.inProgress && d.entryTrades >= mmEligibility.minDailyTrades
  ).length
  const isEligible =
    daysAboveThreshold >= mmEligibility.minDaysRequired ||
    lifetime.entryTrades >= mmEligibility.altTotalTrades

  // Chart data (descending order) — stacked entry + exit
  const chartData = [...tradeData].reverse().map((d) => ({
    date: d.date,
    entryTrades: d.entryTrades,
    exitTrades: d.exitTrades,
    inProgress: d.inProgress,
  }))

  // Table data (descending order)
  const tableData = [...tradeData].reverse()

  const TimeToggle = () => (
    <div className="flex items-center bg-zinc-800 rounded-md p-0.5">
      {(['1d', '7d', 'lifetime'] as TimeFilter[]).map((f) => (
        <button
          key={f}
          onClick={() => setTimeFilter(f)}
          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
            timeFilter === f ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {f === 'lifetime' ? 'Lifetime' : f.toUpperCase()}
        </button>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Summary with 1d / 7d / Lifetime toggle */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-zinc-500">Entry Trades</div>
            <TimeToggle />
          </div>
          <div className="text-2xl font-semibold text-white font-mono">
            {entryTradesDisplay.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400/70 mt-1">Eligible for rewards</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">Exit Trades</div>
          <div className="text-2xl font-semibold text-zinc-400 font-mono">
            {exitTradesDisplay.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-600 mt-1">Not counted for rewards</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">Rewards</div>
          <div className="text-2xl font-semibold text-emerald-400 font-mono">
            ${rewardsDisplay.toLocaleString()}
          </div>
          {timeFilter === '1d' && today.inProgress && currentReward > 0 && (
            <div className="text-[10px] text-indigo-400 mt-1">
              Est. ${currentReward} at EOD
            </div>
          )}
        </div>
      </div>

      {/* Daily Reward Brackets — only highest reached is highlighted */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-white">Daily Reward Brackets</h3>
          <span className="text-[10px] text-zinc-600">Based on entry trades only</span>
        </div>
        <p className="text-xs text-zinc-500 mb-3">
          You earn the reward of the highest bracket you reach each day. Only one reward per day.
        </p>
        <div className="grid grid-cols-4 gap-2">
          {tradeRewardBrackets.map((b, i) => {
            const isCurrent = i === currentBracketIndex
            const isPassed = i < currentBracketIndex
            const isNext = i === currentBracketIndex + 1
            return (
              <div
                key={i}
                className={`rounded-lg border p-3 text-center relative ${
                  isCurrent
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : isNext
                      ? 'bg-zinc-800/30 border-indigo-500/30'
                      : isPassed
                        ? 'bg-zinc-800/30 border-zinc-700'
                        : 'bg-zinc-800/30 border-zinc-800'
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-[9px] text-white font-medium px-1.5 py-0.5 rounded">
                    EARNED
                  </div>
                )}
                {isNext && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-indigo-500 text-[9px] text-white font-medium px-1.5 py-0.5 rounded">
                    NEXT
                  </div>
                )}
                <div className={`text-lg font-semibold font-mono ${
                  isCurrent ? 'text-emerald-400' :
                  isPassed ? 'text-zinc-600' :
                  isNext ? 'text-indigo-400' : 'text-zinc-500'
                }`}>
                  ${b.reward}
                </div>
                <div className={`text-[11px] mt-1 ${
                  isCurrent ? 'text-emerald-400/70' :
                  isPassed ? 'text-zinc-700' :
                  isNext ? 'text-indigo-400/70' : 'text-zinc-600'
                }`}>
                  {b.label} entry trades
                </div>
              </div>
            )
          })}
        </div>

        {/* Next target encouragement */}
        {nextBracket && (
          <div className="mt-3 flex items-center gap-2 bg-indigo-500/5 border border-indigo-500/20 rounded-lg px-3 py-2.5">
            <Target className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div className="text-xs">
              <span className="text-zinc-300">
                {currentReward > 0
                  ? <>You&apos;ve earned <span className="text-emerald-400 font-medium">${currentReward}</span> today. </>
                  : <>No reward yet today. </>
                }
              </span>
              <span className="text-indigo-400">
                {tradesToNext.toLocaleString()} more entry trades to reach ${nextBracket.reward}
                {currentReward > 0 && <> (+${nextBracket.reward - currentReward})</>}
              </span>
            </div>
          </div>
        )}
        {!nextBracket && currentBracketIndex >= 0 && (
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-xs text-emerald-400">
              You&apos;ve hit the maximum bracket! Earning ${currentReward} today.
            </span>
          </div>
        )}
      </div>

      {/* 7-Day Chart — stacked entry + exit */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h3 className="text-sm font-medium text-white">Last 7 Days</h3>
        </div>
        <div className="px-4 pt-4 pb-2">
          <ResponsiveContainer width="100%" height={180}>
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
                formatter={(value: number, name: string) => [
                  value.toLocaleString(),
                  name === 'entryTrades' ? 'Entry Trades' : 'Exit Trades',
                ]}
              />
              <Legend
                formatter={(value: string) =>
                  value === 'entryTrades' ? 'Entry' : 'Exit'
                }
                wrapperStyle={{ fontSize: 11, color: '#71717a' }}
              />
              <ReferenceLine
                y={1000}
                stroke="#3f3f46"
                strokeDasharray="3 3"
                label={{ value: '1K', fill: '#52525b', fontSize: 10, position: 'right' }}
              />
              <Bar dataKey="entryTrades" stackId="trades" fill="#34d399" fillOpacity={0.8} radius={[0, 0, 0, 0]} />
              <Bar dataKey="exitTrades" stackId="trades" fill="#3f3f46" fillOpacity={0.5} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 text-xs border-b border-zinc-800">
                <th className="px-4 py-2.5 text-left font-medium">Date</th>
                <th className="px-4 py-2.5 text-right font-medium">Entry</th>
                <th className="px-4 py-2.5 text-right font-medium">Exit</th>
                <th className="px-4 py-2.5 text-right font-medium">Reward</th>
                <th className="px-4 py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((day, i) => (
                <tr key={i} className="border-b border-zinc-800/40 last:border-0">
                  <td className="px-4 py-2.5 text-zinc-300">{day.date}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-zinc-200">
                    {day.entryTrades.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-zinc-500">
                    {day.exitTrades.toLocaleString()}
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

      <div className="flex items-start gap-1.5 text-[11px] text-zinc-500 px-1">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
        <span>
          Only entry trades count toward daily reward brackets. Exit trades (closing positions)
          are tracked but not eligible for trade incentive rewards. You earn the single highest
          bracket you reach each day.
        </span>
      </div>

      {/* Market Maker Section */}
      {mmEnrolled ? (
        <div className="bg-zinc-900 border border-indigo-500/30 rounded-lg p-4 flex items-center gap-3">
          <Shield className="w-5 h-5 text-indigo-400" />
          <span className="text-sm text-zinc-300">
            You are enrolled in the{' '}
            <span className="text-white font-medium">Market Maker Program</span>. Switch to
            the Market Maker tab to track your maker trade rewards.
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

          {/* Eligibility — based on entry trades */}
          <div className="px-4 py-3 border-b border-zinc-800/60">
            <div className="text-xs text-zinc-500 mb-2.5">Eligibility (based on entry trades)</div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400">
                    {mmEligibility.minDailyTrades.toLocaleString()}+ entry trades/day for{' '}
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
                    {mmEligibility.altTotalTrades.toLocaleString()} entry trades (lifetime)
                  </span>
                  <span
                    className={
                      lifetime.entryTrades >= mmEligibility.altTotalTrades
                        ? 'text-emerald-400'
                        : 'text-zinc-500'
                    }
                  >
                    {lifetime.entryTrades.toLocaleString()}/{mmEligibility.altTotalTrades.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div
                    className={`rounded-full h-1.5 transition-all ${
                      lifetime.entryTrades >= mmEligibility.altTotalTrades
                        ? 'bg-emerald-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (lifetime.entryTrades / mmEligibility.altTotalTrades) * 100)}%`,
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
              {/* MM reward brackets — horizontal */}
              <div>
                <div className="text-xs text-zinc-500 mb-2">Daily maker trade rewards</div>
                <div className="grid grid-cols-5 gap-2">
                  {mmRewardBrackets.map((b) => (
                    <div
                      key={b.label}
                      className="bg-zinc-800/30 border border-zinc-800 rounded-lg p-2.5 text-center"
                    >
                      <div className="text-sm font-semibold text-emerald-400 font-mono">
                        ${b.reward}
                      </div>
                      <div className="text-[10px] text-zinc-600 mt-1 font-mono">
                        {b.label} maker trades
                      </div>
                      {b.rebate > 0 && (
                        <div className="text-[10px] text-indigo-400 mt-0.5">
                          +{b.rebate}% rebate
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* What are maker trades */}
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-lg p-3">
                <div className="text-xs font-medium text-white mb-1.5">What are maker trades?</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  When you place an entry order at any price point and that order is absorbed
                  (filled) by another user, those order quantities count as maker trades. Exit
                  orders are excluded — even if absorbed by another user, they do not count as
                  maker trades.
                </p>
              </div>

              <div className="flex items-start gap-1.5 text-[11px] text-zinc-500">
                <DollarSign className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
                <span>
                  We charge 10% commission on winnings. At higher brackets (25K+ and 50K+),
                  1% or 2% commission is rebated back to your wallet at end-of-day.
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
