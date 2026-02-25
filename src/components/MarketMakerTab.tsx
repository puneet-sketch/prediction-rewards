import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  Label,
} from 'recharts'
import {
  Shield,
  TrendingUp,
  Flame,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowUp,
  Info,
  Percent,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { userMMData, mmTiers } from '../data/mockData'

interface Props {
  enrolled: boolean
  onEnroll: () => void
}

export default function MarketMakerTab({ enrolled, onEnroll }: Props) {
  if (!enrolled) {
    return <NotEnrolledView onEnroll={onEnroll} />
  }

  const tier = mmTiers[userMMData.currentTierIndex]
  const nextTier = mmTiers[userMMData.currentTierIndex + 1]
  const todayProgress = Math.min(
    100,
    Math.round((userMMData.todayLiquidityTrades / userMMData.dailyTarget) * 100)
  )

  const daysHit = userMMData.weeklyTargetHits
  const daysNeeded = tier.retentionDays
  const retentionProgress = Math.round((daysHit / tier.retentionWindow) * 100)
  const isAtRisk = daysHit < daysNeeded
  const daysRemaining = tier.retentionWindow - userMMData.last7Days.filter((d) => !d.inProgress).length

  const chartData = userMMData.last7Days.map((d) => ({
    name: d.date,
    trades: d.liquidityTrades,
    target: d.target,
    hit: d.hit,
    inProgress: d.inProgress || false,
    reward: d.reward,
  }))

  return (
    <div className="space-y-6">
      {/* MM Badge Header */}
      <div className="bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-cyan-600/20 border border-indigo-500/30 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{tier.name}</h2>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-medium px-2 py-0.5 rounded-full">
                  Market Maker
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                {tier.qualification} qualification &middot; {tier.rewardType}
              </p>
            </div>
          </div>
          {nextTier && (
            <div className="bg-slate-800/60 rounded-lg px-4 py-2 text-sm">
              <span className="text-slate-400">Next tier:</span>{' '}
              <span className="text-indigo-300 font-semibold">{nextTier.name}</span>
              <span className="text-slate-500 ml-1">
                ({nextTier.target.toLocaleString()} maker trades/day)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <TrendingUp className="w-4 h-4" />
            Today&apos;s Maker Trades
          </div>
          <div className="text-2xl font-bold text-white">
            {userMMData.todayLiquidityTrades.toLocaleString()}
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Target: {userMMData.dailyTarget.toLocaleString()}</span>
              <span>{todayProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className={`rounded-full h-1.5 transition-all ${todayProgress >= 100 ? 'bg-green-500' : 'bg-violet-500'}`}
                style={{ width: `${todayProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Flame className="w-4 h-4" />
            Upgrade Streak
          </div>
          <div className="text-2xl font-bold text-orange-400">
            {userMMData.currentStreak} / {nextTier ? nextTier.upgradeStreak : tier.upgradeStreak}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {nextTier
              ? `${nextTier.upgradeStreak - userMMData.currentStreak} more consecutive days for ${nextTier.name}`
              : 'Max tier reached'}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <DollarSign className="w-4 h-4" />
            Rewards This Week
          </div>
          <div className="text-2xl font-bold text-green-400">
            ${userMMData.totalRewardsThisWeek.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Credited EOD to Photon wallet</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Percent className="w-4 h-4" />
            Commission Rebate
          </div>
          <div className="text-2xl font-bold text-white">{tier.rebate}</div>
          <div className="text-xs text-slate-500 mt-1">
            {tier.rebateValue > 0
              ? 'Rebate on winnings commission (EOD)'
              : 'Unlock at MM4 (1%) or MM5 (2%)'}
          </div>
        </div>
      </div>

      {/* Retention Status */}
      <div
        className={`border rounded-xl p-4 ${
          isAtRisk
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-green-500/10 border-green-500/30'
        }`}
      >
        <div className="flex items-start gap-3">
          {isAtRisk ? (
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p
                className={`font-medium ${isAtRisk ? 'text-red-300' : 'text-green-300'}`}
              >
                {isAtRisk ? 'Tier Retention At Risk' : 'On Track for Tier Retention'}
              </p>
              <span className="text-sm text-slate-400">
                {daysHit} / {daysNeeded} days needed
                {daysRemaining > 0 && ` (${daysRemaining} days left in window)`}
              </span>
            </div>
            <div className="mt-2 w-full bg-slate-800 rounded-full h-2">
              <div
                className={`rounded-full h-2 transition-all ${isAtRisk ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${retentionProgress}%` }}
              />
            </div>
            {isAtRisk && (
              <p className="text-sm text-slate-400 mt-2">
                You need to hit your daily target at least{' '}
                <span className="text-white font-medium">
                  {daysNeeded}/{tier.retentionWindow}
                </span>{' '}
                days to retain <span className="text-white font-medium">{tier.name}</span>.
                Failing this will result in an{' '}
                <span className="text-red-300 font-medium">immediate downgrade</span> to{' '}
                <span className="text-white font-medium">
                  {mmTiers[userMMData.currentTierIndex - 1]?.name || 'unenrolled'}
                </span>{' '}
                — no grace period.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Streak Visualization */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">This Week&apos;s Activity</h3>
        <div className="grid grid-cols-7 gap-2">
          {userMMData.last7Days.map((day, i) => (
            <div key={i} className="text-center">
              <div className="text-xs text-slate-500 mb-2">{day.date.split(' ')[1]}</div>
              <div
                className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                  day.inProgress
                    ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                    : day.hit
                      ? 'bg-green-500/20 border border-green-500/40 text-green-300'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}
              >
                {day.inProgress ? (
                  <Clock className="w-4 h-4" />
                ) : day.hit ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {(day.liquidityTrades / 1000).toFixed(1)}K
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Liquidity Trades (Maker) — 7 Day
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: number) => `${(val / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'trades')
                  return [value.toLocaleString(), 'Liquidity Trades']
                return [value, name]
              }}
            />
            <ReferenceLine
              y={userMMData.dailyTarget}
              stroke="#8b5cf6"
              strokeDasharray="8 4"
              strokeWidth={2}
            >
              <Label value={`Target: ${userMMData.dailyTarget.toLocaleString()}`} fill="#a78bfa" fontSize={11} position="right" />
            </ReferenceLine>
            <Bar dataKey="trades" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.inProgress ? '#8b5cf6' : entry.hit ? '#22c55e' : '#ef4444'
                  }
                  opacity={entry.inProgress ? 0.6 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tier Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">Market Maker Tiers</h3>
          <p className="text-sm text-slate-400 mt-1">
            All tiers require ≥ 10K total trades/day. Eligible maker trades exclude same-price
            churn (min ±2¢ delta).
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="px-4 py-3 text-left font-medium">Tier</th>
                <th className="px-4 py-3 text-right font-medium">Maker Target</th>
                <th className="px-4 py-3 text-left font-medium">Reward</th>
                <th className="px-4 py-3 text-center font-medium">Streak to Upgrade</th>
                <th className="px-4 py-3 text-center font-medium">Retention</th>
                <th className="px-4 py-3 text-center font-medium">Rebate</th>
              </tr>
            </thead>
            <tbody>
              {mmTiers.map((t, i) => {
                const isCurrent = i === userMMData.currentTierIndex
                const isLocked = i > userMMData.currentTierIndex
                return (
                  <tr
                    key={i}
                    className={`border-b border-slate-800/50 transition-colors ${
                      isCurrent
                        ? 'bg-violet-500/10 border-l-2 border-l-violet-500'
                        : 'hover:bg-slate-800/30'
                    } ${isLocked ? 'opacity-60' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${isCurrent ? 'text-violet-400' : 'text-slate-300'}`}
                        >
                          {t.name}
                        </span>
                        {isCurrent && (
                          <span className="bg-violet-500/20 text-violet-300 text-[10px] font-medium px-1.5 py-0.5 rounded">
                            CURRENT
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-slate-300">
                      {t.target.toLocaleString()} trades/day
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 max-w-[180px]">
                      {t.reward}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-slate-300">
                      {t.upgradeStreak} days
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-slate-300">
                      ≥ {t.retentionDays}/{t.retentionWindow} days
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-sm font-medium ${
                          t.rebateValue > 0 ? 'text-green-400' : 'text-slate-500'
                        }`}
                      >
                        {t.rebate}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-800/30 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">
            Downgrades happen immediately with no grace period. Commission rebates (MM4/MM5) are
            calculated and credited end-of-day. Only trades on designated eligible markets count
            toward maker trade targets.
          </p>
        </div>
      </div>
    </div>
  )
}

function NotEnrolledView({ onEnroll }: { onEnroll: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-violet-500/20 to-indigo-600/20 rounded-2xl flex items-center justify-center mb-6 border border-violet-500/30">
        <Shield className="w-10 h-10 text-violet-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Market Maker Program</h2>
      <p className="text-slate-400 text-center max-w-md mb-6">
        Earn additional rewards for providing liquidity. Available for traders doing 10,000+
        trades per day. Hit your daily targets, build streaks, and unlock commission rebates at
        higher tiers.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mb-8">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
          <TrendingUp className="w-6 h-6 text-violet-400 mx-auto mb-2" />
          <h4 className="text-sm font-medium text-white mb-1">Liquidity Incentives</h4>
          <p className="text-xs text-slate-400">1% of additional trade revenue daily</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
          <ArrowUp className="w-6 h-6 text-violet-400 mx-auto mb-2" />
          <h4 className="text-sm font-medium text-white mb-1">5 Tiers</h4>
          <p className="text-xs text-slate-400">Build streaks to upgrade and earn more</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
          <Percent className="w-6 h-6 text-violet-400 mx-auto mb-2" />
          <h4 className="text-sm font-medium text-white mb-1">Commission Rebates</h4>
          <p className="text-xs text-slate-400">Up to 2% rebate at MM5</p>
        </div>
      </div>

      <button
        onClick={onEnroll}
        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl text-base font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
      >
        Enroll in Market Maker Program <ChevronRight className="w-5 h-5" />
      </button>

      <p className="text-xs text-slate-500 mt-4">
        Requires ≥ 10,000 trades/day to qualify. Check Trade Incentive tab for your activity.
      </p>
    </div>
  )
}
