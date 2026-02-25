import {
  Shield,
  TrendingUp,
  Flame,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { mmLevels, mmUserData } from '../data/mockData'

export default function MarketMakerTab() {
  const level = mmLevels[mmUserData.currentLevelIndex]
  const nextLevel = mmLevels[mmUserData.currentLevelIndex + 1]
  const prevLevel = mmLevels[mmUserData.currentLevelIndex - 1]

  const todayProgress = Math.min(
    100,
    Math.round((mmUserData.todayLiquidityTrades / level.target) * 100)
  )

  const daysHit = mmUserData.weeklyTargetHits
  const daysNeeded = level.retentionDays
  const completedDays = mmUserData.last7Days.filter((d) => !d.inProgress).length
  const daysRemaining = level.retentionWindow - completedDays
  const isAtRisk = daysHit < daysNeeded && daysRemaining === 0
  const isWarning = daysHit < daysNeeded && daysRemaining > 0

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

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">Today&apos;s Maker Trades</div>
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
          <div className="text-xs text-zinc-500 mb-1">Upgrade Streak</div>
          <div className="text-xl font-semibold text-white font-mono">
            {mmUserData.currentStreak}
            {nextLevel && (
              <span className="text-zinc-600 text-base">/{nextLevel.upgradeStreak}</span>
            )}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">
            {nextLevel
              ? `${nextLevel.upgradeStreak - mmUserData.currentStreak} more days for Level ${nextLevel.level}`
              : 'Max level reached'}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">Rewards (7d)</div>
          <div className="text-xl font-semibold text-emerald-400 font-mono">
            ${mmUserData.totalMMRewards.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Credited EOD to wallet</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-xs text-zinc-500 mb-1">Commission Rebate</div>
          <div className="text-xl font-semibold text-white font-mono">
            {level.rebate > 0 ? `${level.rebate}%` : '\u2014'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">
            {level.rebate > 0
              ? 'On winnings commission (EOD)'
              : `Unlock at Level 4 (1%) or Level 5 (2%)`}
          </div>
        </div>
      </div>

      {/* Retention status */}
      <div
        className={`border rounded-lg p-4 ${
          isAtRisk
            ? 'bg-red-500/5 border-red-500/30'
            : isWarning
              ? 'bg-amber-500/5 border-amber-500/30'
              : 'bg-emerald-500/5 border-emerald-500/30'
        }`}
      >
        <div className="flex items-start gap-3">
          {isAtRisk ? (
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          ) : isWarning ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-medium ${
                  isAtRisk ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {isAtRisk
                  ? 'Retention Failed — Downgrade Pending'
                  : isWarning
                    ? 'Retention At Risk'
                    : 'On Track'}
              </span>
              <span className="text-xs text-zinc-500">
                {daysHit}/{daysNeeded} days hit
                {daysRemaining > 0 && ` \u00B7 ${daysRemaining} left`}
              </span>
            </div>
            {(isAtRisk || isWarning) && (
              <p className="text-xs text-zinc-400 mt-1.5">
                You need ≥ {daysNeeded}/{level.retentionWindow} days to retain Level{' '}
                {level.level}. Failing this results in an immediate downgrade to{' '}
                {prevLevel ? `Level ${prevLevel.level}` : 'unenrolled'} — no grace period.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Weekly heatmap */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="text-xs text-zinc-500 mb-3">This week</div>
        <div className="grid grid-cols-7 gap-2">
          {mmUserData.last7Days.map((day, i) => {
            const hit = day.liquidityTrades >= level.target
            return (
              <div key={i} className="text-center">
                <div className="text-[10px] text-zinc-600 mb-1.5">
                  {day.date.replace('Feb ', '')}
                </div>
                <div
                  className={`w-full aspect-square rounded-md flex items-center justify-center ${
                    day.inProgress
                      ? 'bg-indigo-500/10 border border-indigo-500/30'
                      : hit
                        ? 'bg-emerald-500/10 border border-emerald-500/30'
                        : 'bg-zinc-800/50 border border-zinc-800'
                  }`}
                >
                  {day.inProgress ? (
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  ) : hit ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-zinc-600" />
                  )}
                </div>
                <div className="text-[10px] text-zinc-600 mt-1 font-mono">
                  {(day.liquidityTrades / 1000).toFixed(1)}K
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 7-day liquidity table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h3 className="text-sm font-medium text-white">Liquidity Activity (7d)</h3>
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
              {mmUserData.last7Days.map((day, i) => {
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

      {/* Level table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h3 className="text-sm font-medium text-white">All Levels</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 text-xs border-b border-zinc-800">
                <th className="px-4 py-2.5 text-left font-medium">Level</th>
                <th className="px-4 py-2.5 text-right font-medium">Target</th>
                <th className="px-4 py-2.5 text-right font-medium">Reward</th>
                <th className="px-4 py-2.5 text-right font-medium">Rebate</th>
              </tr>
            </thead>
            <tbody>
              {mmLevels.map((l, i) => {
                const isCurrent = i === mmUserData.currentLevelIndex
                return (
                  <tr
                    key={i}
                    className={`border-b border-zinc-800/40 last:border-0 ${
                      isCurrent ? 'bg-indigo-500/5' : ''
                    }`}
                  >
                    <td className="px-4 py-2.5">
                      <span className={isCurrent ? 'text-indigo-400 font-medium' : 'text-zinc-300'}>
                        Level {l.level}
                      </span>
                      {isCurrent && (
                        <span className="ml-1.5 text-[10px] bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded">
                          YOU
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-zinc-400">
                      {l.target.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-emerald-400">
                      ${l.reward}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {l.rebate > 0 ? (
                        <span className="text-indigo-400 font-mono">{l.rebate}%</span>
                      ) : (
                        <span className="text-zinc-600">&mdash;</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade & Downgrade Rules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <ArrowUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-medium text-white">Upgrade Criteria</h3>
          </div>
          <p className="text-xs text-zinc-500 mb-3">
            Hit the next level&apos;s daily target for consecutive days.
          </p>
          <div className="space-y-1.5">
            {mmLevels.slice(0, -1).map((l, i) => {
              const next = mmLevels[i + 1]
              const isNext = i === mmUserData.currentLevelIndex
              return (
                <div
                  key={i}
                  className={`flex justify-between text-xs py-1 px-2 rounded ${
                    isNext ? 'bg-indigo-500/10 text-indigo-300' : ''
                  }`}
                >
                  <span className={isNext ? 'text-indigo-300' : 'text-zinc-500'}>
                    L{l.level} → L{next.level}
                  </span>
                  <span className={isNext ? 'text-indigo-300' : 'text-zinc-400'}>
                    {next.target.toLocaleString()} trades × {next.upgradeStreak}d
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <ArrowDown className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-medium text-white">Downgrade Rules</h3>
          </div>
          <p className="text-xs text-zinc-500 mb-3">
            Fail weekly retention and drop one level immediately. No grace period.
          </p>
          <div className="space-y-1.5">
            {mmLevels.map((l, i) => {
              const isCurrent = i === mmUserData.currentLevelIndex
              return (
                <div
                  key={i}
                  className={`flex justify-between text-xs py-1 px-2 rounded ${
                    isCurrent ? 'bg-red-500/5 text-red-300' : ''
                  }`}
                >
                  <span className={isCurrent ? 'text-red-300' : 'text-zinc-500'}>
                    Level {l.level}
                  </span>
                  <span className={isCurrent ? 'text-red-300' : 'text-zinc-400'}>
                    &lt; {l.retentionDays}/{l.retentionWindow} days → down 1
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-1.5 text-[11px] text-zinc-500 px-1">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
        <span>
          Eligible maker trades must have a minimum ±2¢ price delta. Same-price churn is excluded.
          Commission rebates (Level 4–5) are credited end-of-day. Only trades on designated eligible
          markets count.
        </span>
      </div>
    </div>
  )
}
