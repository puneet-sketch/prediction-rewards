import { useState } from 'react'
import {
  Shield,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
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
import { mmLevels, mmUserData, mmUserLifetime } from '../data/mockData'

export default function MarketMakerTab() {
  const [showLifetime, setShowLifetime] = useState(true)

  const level = mmLevels[mmUserData.currentLevelIndex]
  const nextLevel = mmLevels[mmUserData.currentLevelIndex + 1]

  const todayProgress = Math.min(
    100,
    Math.round((mmUserData.todayLiquidityTrades / level.target) * 100)
  )

  const totalTrades7d = mmUserData.last7Days.reduce((s, d) => s + d.liquidityTrades, 0)
  const totalRewards7d = mmUserData.last7Days
    .filter((d) => !d.inProgress)
    .reduce((s, d) => s + d.reward, 0)

  // Chart data (descending order)
  const chartData = [...mmUserData.last7Days].reverse().map((d) => ({
    date: d.date,
    trades: d.liquidityTrades,
    inProgress: d.inProgress,
  }))

  // Table data (descending order)
  const tableData = [...mmUserData.last7Days].reverse()

  return (
    <div className="space-y-6">
      {/* Level header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-white">Level {level.level}</span>
                <span className="text-xs bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded font-medium">
                  Market Maker
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Target: {level.target.toLocaleString()} maker trades/day &middot; Reward: $
                {level.reward}/day
                {level.rebate > 0 && ` \u00B7 ${level.rebate}% commission rebate`}
              </p>
            </div>
          </div>
          {nextLevel && (
            <div className="hidden sm:block text-right">
              <div className="text-[10px] text-zinc-600 uppercase tracking-wide">Next level</div>
              <div className="text-sm text-zinc-400">
                Level {nextLevel.level}{' '}
                <span className="text-zinc-600">
                  ({nextLevel.target.toLocaleString()} trades)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats row with lifetime/7d toggle */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-zinc-500">Maker Trades</div>
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
          <div className="text-xl font-semibold text-white font-mono">
            {(showLifetime ? mmUserLifetime.trades : totalTrades7d).toLocaleString()}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">
            MM Rewards {showLifetime ? '(lifetime)' : '(7d)'}
          </div>
          <div className="text-xl font-semibold text-emerald-400 font-mono">
            ${(showLifetime ? mmUserData.lifetimeMMRewards : totalRewards7d).toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Credited EOD to wallet</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">Today&apos;s Progress</div>
          <div className="text-xl font-semibold text-white font-mono">
            {mmUserData.todayLiquidityTrades.toLocaleString()}
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
              <span>Target: {level.target.toLocaleString()}</span>
              <span>{todayProgress}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5">
              <div
                className={`rounded-full h-1.5 transition-all ${
                  todayProgress >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${todayProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">Commission Rebate</div>
          <div className="text-xl font-semibold text-white font-mono">
            {level.rebate > 0 ? `${level.rebate}%` : '\u2014'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">
            {level.rebate > 0
              ? 'On winnings commission (EOD)'
              : 'Unlock at Level 4 (1%) or Level 5 (2%)'}
          </div>
        </div>
      </div>

      {/* MM Levels — horizontal cards */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3">Market Maker Levels</h3>
        <div className="grid grid-cols-5 gap-2">
          {mmLevels.map((l, i) => {
            const isCurrent = i === mmUserData.currentLevelIndex
            return (
              <div
                key={l.level}
                className={`rounded-lg border p-3 text-center ${
                  isCurrent
                    ? 'bg-indigo-500/10 border-indigo-500/30'
                    : 'bg-zinc-800/30 border-zinc-800'
                }`}
              >
                <div className={`text-[10px] mb-1 ${isCurrent ? 'text-indigo-400 font-medium' : 'text-zinc-500'}`}>
                  {isCurrent ? '← YOU' : `L${l.level}`}
                </div>
                <div className={`text-lg font-semibold font-mono ${isCurrent ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  ${l.reward}
                </div>
                <div className="text-[10px] text-zinc-600 mt-1 font-mono">
                  {(l.target / 1000).toFixed(0)}K trades
                </div>
                {l.rebate > 0 && (
                  <div className="text-[10px] text-indigo-400 mt-0.5">
                    +{l.rebate}% rebate
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 7-Day Chart + Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h3 className="text-sm font-medium text-white">Liquidity Activity (7d)</h3>
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
                y={level.target}
                stroke="#6366f1"
                strokeDasharray="3 3"
                label={{
                  value: `L${level.level} target`,
                  fill: '#6366f1',
                  fontSize: 10,
                  position: 'right',
                }}
              />
              <Bar dataKey="trades" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={
                      entry.inProgress
                        ? '#6366f1'
                        : entry.trades >= level.target
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
                const hit = day.liquidityTrades >= level.target
                return (
                  <tr key={i} className="border-b border-zinc-800/40 last:border-0">
                    <td className="px-4 py-2.5 text-zinc-300">{day.date}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-zinc-200">
                      {day.liquidityTrades.toLocaleString()}
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
                          <CheckCircle2 className="w-3 h-3" /> Hit
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

      {/* Rebate explanation */}
      <div className="flex items-start gap-1.5 text-[11px] text-zinc-500 px-1">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
        <span>
          We charge 10% commission on winnings. With commission rebate, 1% (Level 4) or 2%
          (Level 5) is deposited back to your wallet at end-of-day. Eligible maker trades must
          have a minimum ±2¢ price delta — same-price churn is excluded.
        </span>
      </div>
    </div>
  )
}
