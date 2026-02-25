import { useState } from 'react'
import {
  Shield,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
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
  Cell,
  ReferenceLine,
} from 'recharts'
import { mmRewardBrackets, mmUserData } from '../data/mockData'

type TimeFilter = '1d' | '7d' | 'lifetime'

export default function MarketMakerTab() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('1d')

  const today = mmUserData.last7Days[mmUserData.last7Days.length - 1]
  const todayMakerTrades = today.makerTrades

  const totalTrades7d = mmUserData.last7Days.reduce((s, d) => s + d.makerTrades, 0)
  const totalRewards7d = mmUserData.last7Days
    .filter((d) => !d.inProgress)
    .reduce((s, d) => s + d.reward, 0)

  // Time-filtered values
  const makerTradesDisplay =
    timeFilter === '1d' ? todayMakerTrades :
    timeFilter === '7d' ? totalTrades7d : mmUserData.lifetimeMakerTrades
  const rewardsDisplay =
    timeFilter === '1d' ? (today.inProgress ? 0 : today.reward) :
    timeFilter === '7d' ? totalRewards7d : mmUserData.lifetimeMMRewards

  // Bracket logic — only the highest reached bracket counts
  const currentBracketIndex = mmRewardBrackets.reduce(
    (highest, b, i) => (todayMakerTrades >= b.minTrades ? i : highest), -1
  )
  const currentReward = currentBracketIndex >= 0 ? mmRewardBrackets[currentBracketIndex].reward : 0
  const currentRebate = currentBracketIndex >= 0 ? mmRewardBrackets[currentBracketIndex].rebate : 0
  const nextBracket = currentBracketIndex < mmRewardBrackets.length - 1
    ? mmRewardBrackets[currentBracketIndex + 1]
    : null
  const tradesToNext = nextBracket ? nextBracket.minTrades - todayMakerTrades : 0

  // Chart data (descending order)
  const chartData = [...mmUserData.last7Days].reverse().map((d) => ({
    date: d.date,
    makerTrades: d.makerTrades,
    inProgress: d.inProgress,
  }))

  // Table data (descending order)
  const tableData = [...mmUserData.last7Days].reverse()

  // Reference line: next bracket target
  const refLineTarget = nextBracket ? nextBracket.minTrades :
    currentBracketIndex >= 0 ? mmRewardBrackets[currentBracketIndex].minTrades : mmRewardBrackets[0].minTrades

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
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-white">Market Maker</span>
              <span className="text-xs bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded font-medium">
                Enrolled
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Earn daily rewards based on your maker trade volume.
              {currentRebate > 0 && <> Today&apos;s bracket includes {currentRebate}% commission rebate.</>}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-zinc-500">Maker Trades</div>
            <TimeToggle />
          </div>
          <div className="text-2xl font-semibold text-white font-mono">
            {makerTradesDisplay.toLocaleString()}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">MM Rewards</div>
          <div className="text-2xl font-semibold text-emerald-400 font-mono">
            ${rewardsDisplay.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Credited EOD to wallet</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">Commission Rebate</div>
          <div className="text-2xl font-semibold text-white font-mono">
            {currentRebate > 0 ? `${currentRebate}%` : '\u2014'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">
            {currentRebate > 0
              ? 'On winnings commission (EOD)'
              : 'Hit 25K+ maker trades for 1% rebate'}
          </div>
        </div>
      </div>

      {/* MM Reward Brackets — horizontal, only highest highlighted */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-white">Daily Maker Trade Rewards</h3>
          <span className="text-[10px] text-zinc-600">Highest bracket only</span>
        </div>
        <p className="text-xs text-zinc-500 mb-3">
          You earn the reward of the highest bracket you reach each day. Only one reward per day.
        </p>
        <div className="grid grid-cols-5 gap-2">
          {mmRewardBrackets.map((b, i) => {
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
                <div className={`text-[10px] mt-1 font-mono ${
                  isCurrent ? 'text-emerald-400/70' :
                  isPassed ? 'text-zinc-700' :
                  isNext ? 'text-indigo-400/70' : 'text-zinc-600'
                }`}>
                  {b.label} maker trades
                </div>
                {b.rebate > 0 && (
                  <div className={`text-[10px] mt-0.5 ${
                    isCurrent ? 'text-indigo-400' :
                    isPassed ? 'text-zinc-700' : 'text-indigo-400/50'
                  }`}>
                    +{b.rebate}% rebate
                  </div>
                )}
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
                  ? <>Earning <span className="text-emerald-400 font-medium">${currentReward}</span> today. </>
                  : <>No reward yet today. </>
                }
              </span>
              <span className="text-indigo-400">
                {tradesToNext.toLocaleString()} more maker trades to reach ${nextBracket.reward}
                {currentReward > 0 && <> (+${nextBracket.reward - currentReward})</>}
                {nextBracket.rebate > 0 && <> with +{nextBracket.rebate}% rebate</>}
              </span>
            </div>
          </div>
        )}
        {!nextBracket && currentBracketIndex >= 0 && (
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-xs text-emerald-400">
              Maximum bracket! Earning ${currentReward} today
              {currentRebate > 0 && <> with {currentRebate}% commission rebate</>}.
            </span>
          </div>
        )}
      </div>

      {/* 7-Day Chart + Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h3 className="text-sm font-medium text-white">Maker Trade Activity (7d)</h3>
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
                formatter={(value: number) => [value.toLocaleString(), 'Maker Trades']}
              />
              <ReferenceLine
                y={refLineTarget}
                stroke="#6366f1"
                strokeDasharray="3 3"
                label={{
                  value: `${(refLineTarget / 1000)}K target`,
                  fill: '#6366f1',
                  fontSize: 10,
                  position: 'right',
                }}
              />
              <Bar dataKey="makerTrades" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={
                      entry.inProgress
                        ? '#6366f1'
                        : entry.makerTrades >= mmRewardBrackets[0].minTrades
                          ? '#34d399'
                          : '#3f3f46'
                    }
                    fillOpacity={entry.inProgress ? 0.6 : 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 text-xs border-b border-zinc-800">
                <th className="px-4 py-2.5 text-left font-medium">Date</th>
                <th className="px-4 py-2.5 text-right font-medium">Maker Trades</th>
                <th className="px-4 py-2.5 text-right font-medium">Reward</th>
                <th className="px-4 py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((day, i) => {
                const hit = day.makerTrades >= mmRewardBrackets[0].minTrades
                return (
                  <tr key={i} className="border-b border-zinc-800/40 last:border-0">
                    <td className="px-4 py-2.5 text-zinc-300">{day.date}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-zinc-200">
                      {day.makerTrades.toLocaleString()}
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
                      ) : hit ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Credited
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                          <XCircle className="w-3 h-3" /> Below
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* What are maker trades + rebate explanation */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
        <div>
          <div className="text-xs font-medium text-white mb-1.5">What are maker trades?</div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            When you place an entry order at any price point and that order is absorbed (filled)
            by another user, those order quantities count as maker trades. Exit orders are
            excluded — even if absorbed by another user, they do not count as maker trades.
          </p>
        </div>
        <div className="border-t border-zinc-800 pt-3 flex items-start gap-1.5 text-[11px] text-zinc-500">
          <DollarSign className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
          <span>
            We charge 10% commission on winnings. At higher brackets (25K+ and 50K+ maker trades),
            1% or 2% of the commission is rebated back to your wallet at end-of-day.
            Same-price churn trades (±2¢ delta minimum) are excluded.
          </span>
        </div>
      </div>
    </div>
  )
}
